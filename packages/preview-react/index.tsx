import React, { useMemo } from "react";

import {
  getLayersWithMaps,
  calculateLayerAtTime,
  Layer,
  Project,
  FONTS,
  PREVIEW_FONT_SIZE,
  getLayerExtents,
} from "engine";

const Preview = ({
  project,
  layers,
  time,
  fontSize = PREVIEW_FONT_SIZE,
  width,
  height,
}: {
  project: Project;
  layers: Layer[];
  time: number;
  fontSize?: number;
  width?: string | number;
  height?: string | number;
}) => {
  const layersWithMaps = useMemo(() => getLayersWithMaps(layers), [layers]);
  const layersAtTime = useMemo(
    () => layersWithMaps.map((l) => calculateLayerAtTime(time, l)),
    [layersWithMaps, time]
  );
  const [calculatedWidth, calculatedHeight] = useMemo(
    () => getLayerExtents(layers),
    [layers]
  );

  return (
    <>
      <div
        style={{
          position: "relative",
          width: width ?? calculatedWidth,
          height: height ?? calculatedHeight,
          fontFamily: `${FONTS[project.font].web}`,
          fontSize,
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
