import { Project, Keyframe } from "./types";

export const updateProjectFrame = (
  project: Project,
  frame: number,
  frameUpdates: Partial<Keyframe>
): Project => {
  const newKeyframes = [...project.keyframes];
  newKeyframes[frame] = {
    ...newKeyframes[frame],
    ...frameUpdates,
  };
  return {
    ...project,
    keyframes: newKeyframes,
  };
};
