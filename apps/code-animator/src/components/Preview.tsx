import React, { useMemo } from "react";

import {
  getLayersWithMaps,
  calculateLayerAtTime,
  FONTS,
  PREVIEW_FONT_SIZE,
} from "engine";
import {
  useProject,
  useTime,
  usePreviewError,
  useLayers,
  getLayerExtents,
} from "../lib/EditorContext";

const Preview = () => {
  const layers = useLayers(PREVIEW_FONT_SIZE);
  const layersWithMaps = useMemo(() => getLayersWithMaps(layers), [layers]);
  const time = useTime();
  const layersAtTime = useMemo(
    () => layersWithMaps.map((l) => calculateLayerAtTime(time, l)),
    [layersWithMaps, time]
  );

  const [width, height] = useMemo(() => getLayerExtents(layers), [layers]);

  const project = useProject();

  if (usePreviewError()) {
    return null;
  }

  return (
    <>
      <div
        style={{
          position: "relative",
          background: "black",
          width,
          height,
          fontFamily: `${FONTS[project.font].web}, Courier New`,
          fontSize: PREVIEW_FONT_SIZE,
        }}
        className="code-preview"
      >
        {layersAtTime.map((l, i) => (
          <div
            key={l.id}
            style={{
              position: "absolute",
              color: `rgb(${l.color.join(",")})`,
              fontStyle: l.italic ? "italic" : "normal",
              fontWeight: l.italic ? "bold" : "normal",
              left: l.location[0],
              top: l.location[1] - l.height,
              display: l.visible ? "block" : "none",
              opacity: l.opacity / 100.0,
              transform: `scale(${l.scale / 100})`,
            }}
            data-id={l.id}
          >
            {l.value}
          </div>
        ))}
      </div>
    </>
  );
};

export default Preview;
