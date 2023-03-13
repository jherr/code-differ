import { Sprite } from "./types";

const calculateExtents = (measuredSprites: Sprite[]) => {
  const extents = [0, 0];
  const extentsByCodeSegment: number[][] = [];

  measuredSprites.forEach((s) => {
    s.pixelLocs!.forEach((l, cs) => {
      if (l) {
        extents[0] = Math.max(extents[0], l![0] + s.width!);
        extents[1] = Math.max(extents[1], l![1] + s.height!);

        if (!extentsByCodeSegment[cs]) {
          extentsByCodeSegment[cs] = [0, 0];
        }
        extentsByCodeSegment[cs][0] = Math.max(
          extentsByCodeSegment[cs][0],
          l![0] + s.width!
        );
        extentsByCodeSegment[cs][1] = Math.max(
          extentsByCodeSegment[cs][1],
          l![1] + s.height!
        );
      }
    });
  });
  return {
    extents,
    extentsByCodeSegment,
  };
};

export default calculateExtents;
