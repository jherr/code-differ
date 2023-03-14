import { useState, useEffect } from "react";
import { IconButton, Box, useTheme, Tooltip } from "@mui/material";
import {
  Settings as SettingsIcon,
  Code as CodeIcon,
  AutoFixHigh as FxIcon,
  HighlightAlt as ToggleIcon,
  ArrowLeft as LeftIcon,
  ArrowRight as RightIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  ClearAll as ClearIcon,
} from "@mui/icons-material";

import {
  useProject,
  useFrame,
  useSetTime,
  useProjectUpdate,
  useToggleEffect,
  useSetEffectOnShown,
  useSelectionEnd,
  useSelectionStart,
  useTime,
  useStep,
  useCodeBlocks,
  useFrameUpdate,
} from "../lib/EditorState";

import Settings from "./Settings";
import SaveLayers from "./SaveLayers";
import LoadProject from "./LoadProject";
import SaveProject from "./SaveProject";
import TimeDialog from "./TimeDialog";

function Toolbar() {
  const project = useProject();
  const frame = useFrame();
  const setTime = useSetTime();
  const updateProject = useProjectUpdate();

  const [settingsOpen, setSettingsOpen] = useState(false);

  const time = useTime();
  const step = useStep();
  const codeBlocks = useCodeBlocks();

  const onAddCode = () => {
    updateProject({
      keyframes: [
        ...project.keyframes,
        {
          type: "code",
          time,
          code: codeBlocks[step],
        },
      ],
    });
  };
  const onAddEffects = () => {
    if (!codeBlocks.length) return;
    updateProject({
      keyframes: [
        ...project.keyframes,
        {
          type: "effects",
          time,
          highlight: {},
        },
      ],
    });
  };

  const isInEffectsEditor =
    frame > 0 && project.keyframes?.[frame]?.type === "effects";

  const toggleEffect = useToggleEffect();
  const setEffectOnShown = useSetEffectOnShown();
  const selectionStart = useSelectionStart();
  const selectionEnd = useSelectionEnd();
  const onHighlight = () => {
    if (selectionStart !== null && selectionEnd !== null) {
      setEffectOnShown();
    } else {
      toggleEffect();
    }
  };

  const isOnFirstFrame = frame === 0;
  const isOnLastFrame =
    frame === project.keyframes.length - 1 || project.keyframes.length === 0;

  const onPreviousKeyFrame = () => {
    if (!isOnFirstFrame) {
      setTime(project.keyframes[frame - 1].time);
    }
  };
  const onNextKeyFrame = () => {
    if (!isOnLastFrame) {
      setTime(project.keyframes[frame + 1].time);
    }
  };

  const onDeleteFrame = () => {
    if (project.keyframes.length > 0) {
      const newKeyframes = [...project.keyframes];
      newKeyframes.splice(frame, 1);
      updateProject({
        keyframes: newKeyframes,
      });
    }
  };

  const updateFrame = useFrameUpdate();
  const [showTimeDialog, setShowTimeDialog] = useState(false);
  const onTimeSave = (time: number | null) => {
    if (time) {
      updateFrame({ time });
    }
    setShowTimeDialog(false);
  };

  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setTime((t) => (t + 0.1) % project.totalTime);
    }, 100);
    return () => clearInterval(interval);
  }, [playing, project.totalTime]);

  const onClearProject = () => {
    updateProject({
      keyframes: [],
      totalTime: 20,
      name: "Code-1",
      animationDuration: 0.3,
      font: "JetBrains Mono",
      showBackground: false,
    });
  };

  const theme = useTheme();

  return (
    <>
      {showTimeDialog && (
        <TimeDialog
          open={true}
          time={project.keyframes?.[frame]?.time ?? 0}
          key={`td-${frame}`}
          onSave={onTimeSave}
        />
      )}

      <Settings
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        project={project}
        onUpdate={updateProject}
      />

      <Box
        sx={{
          alignContent: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Tooltip title="Highlight Code">
          <IconButton
            onClick={onHighlight}
            sx={{
              color: isInEffectsEditor ? theme.palette.primary.main : "gray",
            }}
          >
            <ToggleIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Previous Frame">
          <IconButton
            onClick={onPreviousKeyFrame}
            sx={{
              color: isOnFirstFrame ? "gray" : theme.palette.primary.main,
            }}
          >
            <LeftIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Change Time">
          <IconButton
            onClick={() => setShowTimeDialog(true)}
            sx={{
              color:
                project.keyframes.length > 0
                  ? theme.palette.primary.main
                  : "gray",
            }}
          >
            <TimeIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Previous Frame">
          <IconButton
            onClick={onNextKeyFrame}
            sx={{
              color: isOnLastFrame ? "gray" : theme.palette.primary.main,
            }}
          >
            <RightIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Add Code">
          <IconButton onClick={onAddCode} color="primary">
            <CodeIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Add Highlighting">
          <IconButton
            onClick={onAddEffects}
            color="primary"
            sx={{
              color:
                codeBlocks.length > 0 ? theme.palette.primary.main : "gray",
            }}
          >
            <FxIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete Frame">
          <IconButton
            onClick={onDeleteFrame}
            sx={{
              color:
                project.keyframes.length > 0
                  ? theme.palette.primary.main
                  : "gray",
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>

        {playing ? (
          <Tooltip title="Pause">
            <IconButton onClick={() => setPlaying(false)} color="primary">
              <PauseIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Play">
            <IconButton onClick={() => setPlaying(true)} color="primary">
              <PlayIcon />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Clear Project">
          <IconButton onClick={onClearProject} color="primary">
            <ClearIcon />
          </IconButton>
        </Tooltip>

        <SaveLayers />

        <SaveProject />

        <LoadProject />

        <Tooltip title="Project Settings">
          <IconButton onClick={() => setSettingsOpen(true)} color="primary">
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </>
  );
}

export default Toolbar;
