import { useState, useRef, useMemo, useEffect } from "react";
import { Box, useTheme, Typography } from "@mui/material";
import {
  Code as CodeIcon,
  AutoFixHigh as FxIcon,
  Navigation as ArrowIcon,
} from "@mui/icons-material";
import { useWindowSize } from "usehooks-ts";

import { useProject, useSetTime, useTime } from "../lib/EditorContext";

const secondsToTime = (secs: number, precision: number = 1) => {
  const minutes = Math.floor(secs / 60);
  const seconds = secs - minutes * 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds.toFixed(precision)}`;
};

const Timeline = () => {
  const sideGutter = 75;
  const topGutter = 50;
  const effectsLineOffset = topGutter + 20;
  const codeLineOffset = topGutter + 60;
  const iconSize = 25;
  const ballSize = 10;

  const project = useProject();
  const onSetTime = useSetTime();
  const time = useTime();

  const theme = useTheme();

  const [tracking, setTracking] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  const [pixelsPerSecond, setPixelsPerSecond] = useState(15);
  const { width } = useWindowSize();
  useEffect(() => {
    setPixelsPerSecond(
      Math.max(5, (width * 0.7 - sideGutter) / project.totalTime)
    );
  }, [width, project.totalTime]);

  const timelineWidth = project.totalTime * pixelsPerSecond;
  const timelineHeight = codeLineOffset + iconSize;

  const secondsPerSection = 10;
  const secondsSections = useMemo(
    () =>
      new Array(Math.floor(project.totalTime / secondsPerSection))
        .fill(0)
        .map((_, i) => i * secondsPerSection),
    [project.totalTime]
  );

  const onMouseDown = (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.MouseEvent<SVGGElement, MouseEvent>
  ) => {
    const newTime =
      (e.clientX - (timelineRef.current?.offsetLeft ?? 0) - sideGutter) /
      pixelsPerSecond;
    onSetTime(Math.max(0, Math.min(newTime, project.totalTime)));
    setTracking(true);
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        width: timelineWidth + sideGutter,
      }}
      ref={timelineRef}
      onMouseUp={() => setTracking(false)}
      onMouseMove={(e) => {
        if (tracking) {
          const newTime =
            (e.clientX - (timelineRef.current?.offsetLeft ?? 0) - sideGutter) /
            pixelsPerSecond;
          onSetTime(Math.max(0, Math.min(newTime, project.totalTime)));
        }
      }}
    >
      <FxIcon
        style={{
          position: "absolute",
          top: effectsLineOffset - iconSize / 2,
          left: sideGutter / 2 - iconSize / 2,
          width: iconSize,
          height: iconSize,
          color: "white",
        }}
      />
      <CodeIcon
        style={{
          position: "absolute",
          top: codeLineOffset - iconSize / 2,
          left: sideGutter / 2 - iconSize / 2,
          width: iconSize,
          height: iconSize,
          color: "white",
        }}
      />
      <svg
        onMouseDown={onMouseDown}
        width={timelineWidth + ballSize * 2}
        height={timelineHeight}
        style={{
          position: "absolute",
          top: 0,
          left: sideGutter - ballSize,
        }}
        viewBox={`${-ballSize} 0 ${
          timelineWidth + ballSize * 2
        } ${timelineHeight}`}
      >
        <line
          x1={0}
          y1={codeLineOffset}
          x2={timelineWidth}
          y2={codeLineOffset}
          style={{ stroke: theme.palette.grey[700], strokeWidth: 0.5 }}
        />
        <line
          x1={0}
          y1={effectsLineOffset}
          x2={timelineWidth}
          y2={effectsLineOffset}
          style={{ stroke: theme.palette.grey[700], strokeWidth: 0.5 }}
        />
        <line
          x1={time * pixelsPerSecond}
          y1={topGutter}
          x2={time * pixelsPerSecond}
          y2={timelineHeight}
          style={{ stroke: theme.palette.grey[400], strokeWidth: 0.5 }}
        />
        {secondsSections.map((seconds) => (
          <g key={`t-${seconds}`}>
            <text
              x={seconds * pixelsPerSecond}
              y={topGutter - 10}
              style={{
                fill: theme.palette.grey[700],
                fontSize: 10,
                textAnchor: "middle",
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              {secondsToTime(seconds, 0)}
            </text>
            <line
              x1={seconds * pixelsPerSecond}
              y1={topGutter}
              x2={seconds * pixelsPerSecond}
              y2={timelineHeight}
              style={{
                stroke: theme.palette.grey[700],
                strokeWidth: 0.5,
                strokeDasharray: "5 5",
              }}
            />
          </g>
        ))}
        {project.keyframes.map((keyframe) => (
          <g key={`l-${keyframe.time}`}>
            <line
              x1={keyframe.time * pixelsPerSecond}
              y1={topGutter}
              x2={keyframe.time * pixelsPerSecond}
              y2={timelineHeight}
              style={{ stroke: theme.palette.grey[200], strokeWidth: 2.5 }}
            />
            <circle
              cx={keyframe.time * pixelsPerSecond}
              cy={
                keyframe.type === "effects" ? effectsLineOffset : codeLineOffset
              }
              r={ballSize}
              style={{ fill: theme.palette.grey[200] }}
            />
          </g>
        ))}
      </svg>

      <ArrowIcon
        onMouseDown={onMouseDown}
        style={{
          position: "absolute",
          top: topGutter - iconSize + 2,
          left: sideGutter + time * pixelsPerSecond - iconSize / 2,
          width: iconSize,
          height: iconSize,
          color: "white",
          transform: "rotate(180deg)",
        }}
      />

      <Typography
        variant="body2"
        style={{
          position: "absolute",
          top: topGutter - 40,
          left: sideGutter + time * pixelsPerSecond - 20,
          color: "white",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {secondsToTime(time)}
      </Typography>
    </Box>
  );
};

export default Timeline;
