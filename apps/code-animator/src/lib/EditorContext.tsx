import { createContext, useState, useContext, useMemo } from "react";

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

import Code1 from "./Code-1-project";

const sortFrames = (frames: Keyframe[]): Keyframe[] =>
  [...frames].sort((a, b) => (a.time < b.time ? -1 : 1));

const useEditorState = () => {
  const [project, setProject] = useState<Project>(Code1);
  const [time, setTime] = useState(4);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);

  const { sprites, error: previewError } = useMemo(
    () => createMeasuredSprites(project, PREVIEW_FONT_SIZE),
    [project, project.keyframes]
  );

  return {
    time,
    setTime,
    project,
    setProject,
    selectionStart,
    setSelectionStart,
    selectionEnd,
    setSelectionEnd,
    sprites,
    previewError,
  };
};

const EditorContext = createContext<ReturnType<typeof useEditorState>>(
  null as unknown as ReturnType<typeof useEditorState>
);

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const state = useEditorState();
  return (
    <EditorContext.Provider value={state}>{children}</EditorContext.Provider>
  );
};

const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditorContext must be used within a EditorProvider");
  }
  return context;
};

export const useTime = () => useEditorContext().time;
export const useSetTime = () => useEditorContext().setTime;

export const useProject = () => useEditorContext().project;
const useSetProject = () => useEditorContext().setProject;

const ensureKeyframes = (project: Project) => ({
  ...project,
  keyframes: sortFrames(project.keyframes),
});

export const useProjectUpdate = () => {
  const project = useProject();
  const setProject = useSetProject();
  return (projectUpdates: Partial<Project>) => {
    setProject(
      ensureKeyframes({
        ...project,
        ...projectUpdates,
      })
    );
  };
};
export const useFrameUpdate = () => {
  const project = useProject();
  const setProject = useSetProject();
  const frame = useFrame();

  return (frameUpdates: Partial<Keyframe>) => {
    setProject(
      ensureKeyframes(updateProjectFrame(project, frame, frameUpdates))
    );
  };
};

export const useFrame = () => {
  const project = useProject();
  const time = useTime();
  return useMemo(() => {
    let frame = -1;
    for (let i = 0; i < project.keyframes.length; i++) {
      if (project.keyframes[i].time > time) break;
      frame = i;
    }
    return frame;
  }, [project, time]);
};
export const useStep = () => {
  const project = useProject();
  const time = useTime();
  const times = getCodeTimes(project.keyframes);
  let step = 0;
  for (let i = 0; i < times.length; i++) {
    if (times[i] > time) break;
    step = i;
  }
  return step;
};

export const useEffectFrames = () => {
  const project = useProject();
  return useMemo(() => getEffectFrames(project.keyframes), [project.keyframes]);
};

export const useCodeFrames = () => {
  const project = useProject();
  return useMemo(() => getCodeFrames(project.keyframes), [project.keyframes]);
};

export const useCodeBlocks = () => {
  const codeFrames = useCodeFrames();
  return useMemo(() => getCodeBlocks(codeFrames), [codeFrames]);
};

export const useSprites = () => useEditorContext().sprites;
export const usePreviewError = () => useEditorContext().previewError;

export const useSelectionStart = () => useEditorContext().selectionStart;
export const useSetSelectionStart = () => useEditorContext().setSelectionStart;
export const useSelectionEnd = () => useEditorContext().selectionEnd;
export const useSetSelectionEnd = () => useEditorContext().setSelectionEnd;

export const useChangeEffect = () => {
  const updateFrame = useFrameUpdate();
  const sprites = useSprites();

  return (hilight: boolean) => {
    updateFrame({
      highlight: sprites.reduce((acc, t, i) => {
        acc[i] = hilight;
        return acc;
      }, {} as Record<number, boolean>),
    });
  };
};

export const useToggleEffect = () => {
  const frame = useFrame();
  const project = useProject();
  const updateFrame = useFrameUpdate();
  const sprites = useSprites();

  return () => {
    if (project.keyframes[frame].type === "effects") {
      const effects = project.keyframes[frame]?.highlight! ?? {};
      const hilight = Object.values(effects).some((t) => !t);
      updateFrame({
        highlight: sprites.reduce((acc, t, i) => {
          acc[i] = hilight;
          return acc;
        }, {} as Record<number, boolean>),
      });
    }
  };
};

export const useIsVisuallySelected = () => {
  const selectionStart = useSelectionStart();
  const selectionEnd = useSelectionEnd();
  const sprites = useSprites();
  const step = useStep();

  return (i: number) => {
    if (selectionStart === null || selectionEnd === null) return false;

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
    setSelectionStart(null);
    setSelectionEnd(null);
  };
};

export const useLayers = (fontSize: number) => {
  const project = useProject();

  return getLayers(project, fontSize);
};
