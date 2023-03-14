import { Keyframe, Project, Layer } from "./types";
import convertCodeBlocksToTokens from "./differ";
import measureSprites from "./measureSprites";
import calculateLayers from "./layers";
import FONTS from "./fonts";
import { MARGIN } from "./constants";

export const getCodeFrames = (keyframes: Keyframe[]) =>
  keyframes.filter(({ type }) => type === "code");
export const getCodeTimes = (keyframes: Keyframe[]) =>
  getCodeFrames(keyframes).map(({ time }) => time);
export const getEffectFrames = (keyframes: Keyframe[]) =>
  keyframes.filter(({ type }) => type === "effects");
export const getCodeBlocks = (keyframes: Keyframe[]) =>
  getCodeFrames(keyframes).map(({ code }) => code!);

export const createMeasuredSprites = (project: Project, fontSize: number) => {
  if (!project.keyframes || project.keyframes.length === 0) {
    return { sprites: [] as ReturnType<typeof measureSprites>, error: null };
  }

  const { sprites, tracks, error } = convertCodeBlocksToTokens(
    getCodeBlocks(getCodeFrames(project.keyframes))
  );

  if (error) {
    return { sprites: [] as ReturnType<typeof measureSprites>, error };
  }

  return {
    sprites: measureSprites(
      sprites,
      FONTS[project.font].web,
      fontSize,
      tracks,
      MARGIN
    ),
    error: null,
  };
};

export const getLayers = (project: Project, fontSize: number) => {
  return calculateLayers(
    createMeasuredSprites(project, fontSize).sprites,
    getEffectFrames(project.keyframes),
    getCodeTimes(project.keyframes),
    project.totalTime,
    project.animationDuration
  );
};

export const getLayerExtents = (layers: Layer[]) => {
  let width = 0;
  let height = 0;
  for (const l of layers) {
    const [x, y] = [l.location[0] + l.width, l.location[1]];
    if (x > width) width = x;
    if (y > height) height = y;
    for (const trans of l.transitions.filter((t) => t.type === "move")) {
      const [x, y] = trans.location!;
      if (x > width) width = x;
      if (y > height) height = y;
    }
  }
  return [width + MARGIN, height + MARGIN];
};
