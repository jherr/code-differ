import React, { useState, useMemo, useEffect } from "react";
import { Box } from "@mui/material";

import { FONTS, PREVIEW_FONT_SIZE } from "engine";

import {
  useSelectionEnd,
  useSetSelectionEnd,
  useSelectionStart,
  useSetSelectionStart,
  useStep,
  useFrame,
  useProject,
  useSprites,
  useIsVisuallySelected,
} from "../lib/EditorContext";

const EffectsEditor = () => {
  const sprites = useSprites();

  const step = useStep();
  const height = useMemo(
    () =>
      Math.max(
        0,
        ...sprites
          .filter((t) => t.pixelLocs?.[step])
          .map((t) => t.pixelLocs![step]![1] + t.height!)
      ),
    [sprites, step]
  );

  const selectionStart = useSelectionStart();
  const setSelectionStart = useSetSelectionStart();
  const selectionEnd = useSelectionEnd();
  const setSelectionEnd = useSetSelectionEnd();

  const frame = useFrame();
  const project = useProject();
  const effects = project.keyframes[frame]?.highlight ?? {};

  const [tracking, setTracking] = useState(false);
  useEffect(() => {
    if (selectionStart === null && selectionEnd === null && tracking) {
      setTracking(false);
    }
  }, [selectionStart, selectionEnd, tracking]);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!effects) return;

    const target = e.target as HTMLDivElement;
    const index = parseInt(target.getAttribute("data-index") || "-1");
    if (index > 0) {
      setSelectionStart(index);
      setSelectionEnd(index);
      setTracking(true);
    } else {
      setSelectionStart(null);
      setSelectionEnd(null);
      setTracking(false);
    }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!effects || !tracking || selectionStart === null) return;

    const target = e.target as HTMLDivElement;
    const index = parseInt(target.getAttribute("data-index") || "-1");
    if (index >= 0) {
      setSelectionStart(Math.min(selectionStart, index));
      setSelectionEnd(Math.max(selectionStart, index));
    }
  };

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!effects) return;
    setTracking(false);
  };

  const isVisuallySelected = useIsVisuallySelected();

  if (frame < 0) {
    return null;
  }

  return (
    <Box>
      <div
        style={{
          position: "relative",
          fontFamily: `${FONTS[project.font].web}, Courier New`,
          fontSize: PREVIEW_FONT_SIZE,
          background: "black",
          height,
        }}
        className="code-preview"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        {sprites.map((t, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              color: `rgb(${t.color.join(",")})`,
              fontStyle: t.italic ? "italic" : "normal",
              fontWeight: t.italic ? "bold" : "normal",
              top: t.pixelLocs![step]
                ? t.pixelLocs![step]![1] - t.height!
                : undefined,
              left: t.pixelLocs![step] ? t.pixelLocs![step]![0] : undefined,
              ...(effects && {
                opacity: effects[i] ? 1.0 : 0.5,
                cursor: "pointer",
                userSelect: "none",
              }),
              ...(selectionStart !== null &&
                selectionEnd !== null && {
                  background: isVisuallySelected(i)
                    ? "rgba(255,255,255,0.6)"
                    : undefined,
                }),
              display: t.state![step] === "shown" ? "block" : "none",
            }}
            data-index={i}
          >
            {t.value}
          </div>
        ))}
      </div>
    </Box>
  );
};

export default EffectsEditor;
