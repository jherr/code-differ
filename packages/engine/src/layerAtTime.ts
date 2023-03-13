import {
  Layer,
  Transition,
  TimeAndValue,
  LayerWithMaps,
  LayerAtTime,
} from "./types";

const buildTimeMap = (
  transitions: Transition[],
  property: Transition["type"],
  fetchValue: (t: Transition) => number
) => {
  const filteredTransitions = transitions.filter((t) => t.type === property);
  return filteredTransitions.map((t, i) => ({
    start: t.time,
    end:
      i === filteredTransitions.length - 1
        ? Infinity
        : filteredTransitions[i + 1].time,
    from: fetchValue(t),
    to:
      i === filteredTransitions.length - 1
        ? fetchValue(filteredTransitions[i])
        : fetchValue(filteredTransitions[i + 1]),
  }));
};

const getValueAtTime = (time: number, map: TimeAndValue[]): number => {
  if (map.length === 0) return 0;
  if (map.length === 1) return map[0].to;
  for (const transition of map) {
    if (time >= transition.start && time <= transition.end) {
      const diff = transition.end - transition.start;
      const timeDiff = time - transition.start;
      const valueDiff = transition.to - transition.from;
      return transition.from + (valueDiff / diff) * timeDiff;
    }
  }
  return 0;
};

export const calculateLayerAtTime = (
  time: number,
  layer: LayerWithMaps
): LayerAtTime => {
  const visible = time >= layer.startTime && time <= layer.endTime;

  return {
    ...layer,
    visible,
    opacity: visible ? getValueAtTime(time, layer.alphaMap) : 0,
    scale: visible ? getValueAtTime(time, layer.scaleMap) : 0,
    location: [
      visible ? getValueAtTime(time, layer.xMap) : 0,
      visible ? getValueAtTime(time, layer.yMap) : 0,
    ],
    color: [
      visible ? getValueAtTime(time, layer.rMap) : 0,
      visible ? getValueAtTime(time, layer.gMap) : 0,
      visible ? getValueAtTime(time, layer.bMap) : 0,
    ],
  };
};

export const getLayersWithMaps = (layers: Layer[]): LayerWithMaps[] =>
  layers.map((l) => ({
    ...l,
    alphaMap: buildTimeMap(l.transitions, "alpha", (t) => t.value!),
    scaleMap: buildTimeMap(l.transitions, "scale", (t) => t.value!),
    xMap: buildTimeMap(l.transitions, "move", (t) => t.location![0]),
    yMap: buildTimeMap(l.transitions, "move", (t) => t.location![1]),
    rMap: buildTimeMap(l.transitions, "color", (t) => t.color![0]),
    gMap: buildTimeMap(l.transitions, "color", (t) => t.color![1]),
    bMap: buildTimeMap(l.transitions, "color", (t) => t.color![2]),
  }));
