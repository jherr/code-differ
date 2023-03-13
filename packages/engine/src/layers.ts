import { Layer, CompletedSprite, Transition, Keyframe } from "./types";

export const calculateLayers = (
  sprites: CompletedSprite[],
  effectFrames: Keyframe[],
  times: number[],
  duration: number,
  animationDuration: number = 0.3
): Layer[] => {
  const nudgeIndex: number[] = [];
  return sprites.map((sprite, i) => {
    let start: number | null = null;
    let end: number = 0;
    let startLoc = [0, 0];
    for (const l in sprite.locs) {
      if (sprite.locs[l] !== null) {
        if (start === null) {
          start = +l;
          startLoc = sprite.pixelLocs[l]!;
        }
        end = +l + 1;
      }
    }

    if (nudgeIndex[start!] === undefined) {
      nudgeIndex[start!] = 0;
    }
    nudgeIndex[start!] += 1;
    const nudge = nudgeIndex[start!] / (150 * (2 - animationDuration));

    const startTime = times[start!] + nudge;
    const endTime = times[end] || duration;
    const transitions: Transition[] = [
      {
        type: "move",
        time: startTime + nudge,
        location: startLoc as [number, number],
      },
      {
        type: "color",
        time: startTime + nudge,
        color: [255, 255, 255],
      },
      {
        type: "color",
        time: startTime + animationDuration + nudge,
        color: sprite.color,
      },
      {
        type: "alpha",
        time: startTime + nudge,
        value: 0,
      },
      {
        type: "alpha",
        time: startTime + animationDuration + nudge,
        value: 100,
      },
      {
        type: "scale",
        time: startTime + nudge,
        value: 140,
      },
      {
        type: "scale",
        time: startTime + animationDuration + nudge,
        value: 100,
      },
      {
        type: "scale",
        time: endTime - animationDuration,
        value: 100,
      },
      {
        type: "scale",
        time: endTime,
        value: 30,
      },
    ];

    let lastAlpha = 100;
    for (const frame of effectFrames.filter(
      ({ time }) => time >= startTime && time <= endTime
    )) {
      if (frame.time >= startTime && frame.time <= endTime) {
        transitions.push({
          type: "alpha",
          time: frame.time - animationDuration,
          value: lastAlpha,
        });
        lastAlpha = frame.highlight![i] ? 100 : 30;
        transitions.push({
          type: "alpha",
          time: frame.time,
          value: lastAlpha,
        });
      }
    }
    transitions.push({
      type: "alpha",
      time: endTime - animationDuration,
      value: lastAlpha,
    });
    transitions.push({
      type: "alpha",
      time: endTime,
      value: 0,
    });

    for (const l in sprite.locs) {
      if (sprite.locs[l] !== null && +l !== start) {
        if (times[+l] > 0) {
          transitions.push({
            type: "move",
            time: times[+l] - animationDuration,
            location: sprite.pixelLocs![+l - 1]!,
          });
        }
        transitions.push({
          type: "move",
          time: times[+l],
          location: sprite.pixelLocs![+l]!,
        });
      }
    }

    return {
      type: "text",
      id: sprite.id,
      value: sprite.value,
      italic: sprite.italic,
      color: sprite.color,
      width: sprite.width,
      height: sprite.height,
      textHeight: sprite.textHeight!,
      location: sprite.pixelLocs![start!]!,
      transitions: transitions.sort((a, b) => a.time - b.time),
      startTime,
      endTime,
    };
  });
};

export default calculateLayers;
