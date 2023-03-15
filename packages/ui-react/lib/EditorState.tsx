import { atom, useAtomValue, useSetAtom } from "jotai";

import {
  Project,
  Keyframe,
  PREVIEW_FONT_SIZE,
  updateProjectFrame,
  getEffectFrames,
  getCodeFrames,
  getCodeBlocks,
  getCodeTimes,
  createMeasuredSprites,
  getLayers,
} from "engine";

const sortFrames = (frames: Keyframe[]): Keyframe[] =>
  [...frames].sort((a, b) => (a.time < b.time ? -1 : 1));

const ensureKeyframes = (project: Project) => ({
  ...project,
  keyframes: sortFrames(project.keyframes),
});

const projectAtom = atom<Project>({
  keyframes: [],
  name: "Untitled",
  totalTime: 10,
  font: "Dank Mono",
  animationDuration: 0.3,
  showBackground: false,
});
const timeAtom = atom(4);
const selectionStartAtom = atom<number | false>(false);
const selectionEndAtom = atom<number | false>(false);

const safeProjectAtom = atom(
  (get) => get(projectAtom),
  (get, set, update: Partial<Project>) => {
    set(projectAtom, ensureKeyframes({ ...get(projectAtom), ...update }));
  }
);

const effectFramesAtom = atom((get) =>
  getEffectFrames(get(safeProjectAtom).keyframes)
);
const codeFramesAtom = atom((get) =>
  getCodeFrames(get(safeProjectAtom).keyframes)
);
const codeBlocksAtom = atom((get) => getCodeBlocks(get(codeFramesAtom)));

const measuredSpritesAtom = atom((get) => {
  const project = get(projectAtom);
  const { sprites, error } = createMeasuredSprites(project, PREVIEW_FONT_SIZE);
  return { sprites, error };
});

const previewErrorAtom = atom((get) => get(measuredSpritesAtom).error);
const spritesAtom = atom((get) => get(measuredSpritesAtom).sprites);

const frameAtom = atom((get) => {
  const project = get(safeProjectAtom);
  const time = get(timeAtom);
  let frame = -1;
  for (let i = 0; i < project.keyframes.length; i++) {
    if (project.keyframes[i].time > time) break;
    frame = i;
  }
  return frame;
});

const stepAtom = atom((get) => {
  const project = get(safeProjectAtom);
  const time = get(timeAtom);
  const times = getCodeTimes(project.keyframes);
  let step = 0;
  for (let i = 0; i < times.length; i++) {
    if (times[i] > time) break;
    step = i;
  }
  return step;
});

const frameUpdateAtom = atom(
  () => null,
  (get, set, frameUpdates: Partial<Keyframe>) => {
    const project = get(safeProjectAtom);
    const frame = get(frameAtom);
    set(safeProjectAtom, updateProjectFrame(project, frame, frameUpdates));
  }
);

const toggleEffectAtom = atom(
  () => null,
  (get, set) => {
    const frame = get(frameAtom);
    const project = get(safeProjectAtom);
    const sprites = get(spritesAtom);

    return () => {
      if (project.keyframes[frame].type === "effects") {
        const effects = project.keyframes[frame]?.highlight! ?? {};
        const hilight = Object.values(effects).some((t) => !t);
        set(frameUpdateAtom, {
          highlight: sprites.reduce((acc, t, i) => {
            acc[i] = hilight;
            return acc;
          }, {} as Record<number, boolean>),
        });
      }
    };
  }
);

export const useTime = () => useAtomValue(timeAtom);
export const useSetTime = () => useSetAtom(timeAtom);

export const useProject = () => useAtomValue(safeProjectAtom);
export const useProjectUpdate = () => useSetAtom(safeProjectAtom);

export const useFrameUpdate = () => useSetAtom(frameUpdateAtom);

export const useFrame = () => useAtomValue(frameAtom);
export const useStep = () => useAtomValue(stepAtom);

export const useEffectFrames = () => useAtomValue(effectFramesAtom);
export const useCodeFrames = () => useAtomValue(codeFramesAtom);
export const useCodeBlocks = () => useAtomValue(codeBlocksAtom);

export const useSprites = () => useAtomValue(spritesAtom);
export const usePreviewError = () => useAtomValue(previewErrorAtom);

export const useSelectionStart = () => useAtomValue(selectionStartAtom);
export const useSetSelectionStart = () => useSetAtom(selectionStartAtom);
export const useSelectionEnd = () => useAtomValue(selectionEndAtom);
export const useSetSelectionEnd = () => useSetAtom(selectionEndAtom);

export const useToggleEffect = () => useSetAtom(toggleEffectAtom);

export const useIsVisuallySelected = () => {
  const selectionStart = useSelectionStart();
  const selectionEnd = useSelectionEnd();
  const sprites = useSprites();
  const step = useStep();

  return (i: number) => {
    if (selectionStart === false || selectionEnd === false) return false;

    const startLeft = sprites[selectionStart].pixelLocs![step]![0];
    const startTop = sprites[selectionStart].pixelLocs![step]![1];
    const endLeft = sprites[selectionEnd].pixelLocs![step]![0];
    const endTop = sprites[selectionEnd].pixelLocs![step]![1];

    const left = sprites[i].pixelLocs?.[step]?.[0];
    const top = sprites[i].pixelLocs?.[step]?.[1];

    if (!left || !top) return false;
    if (top < startTop || top > endTop) return false;
    if (top === startTop && left < startLeft) return false;
    if (top === endTop && left > endLeft) return false;
    return true;
  };
};

export const useSetEffectOnShown = () => {
  const isVisuallySelected = useIsVisuallySelected();
  const sprites = useSprites();
  const frame = useFrame();
  const project = useProject();

  const updateFrame = useFrameUpdate();
  const setSelectionStart = useSetSelectionStart();
  const setSelectionEnd = useSetSelectionEnd();

  const effects = project.keyframes[frame]?.highlight!;

  return () => {
    updateFrame({
      highlight: sprites.reduce((acc, t, i) => {
        acc[i] = effects[i] || isVisuallySelected(i);
        return acc;
      }, {} as Record<number, boolean>),
    });
    setSelectionStart(false);
    setSelectionEnd(false);
  };
};

export const useLayers = (fontSize: number) => {
  const project = useProject();

  return getLayers(project, fontSize);
};
