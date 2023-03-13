export interface Sprite {
  id: number;
  locs: ([col: number, row: number] | null)[];
  pixelLocs?: ([x: number, y: number] | null)[];
  state?: string[];
  value: string;
  color: number[];
  italic: boolean;
  className: string;
  height?: number;
  width?: number;
  textHeight?: number;
}

export type CompletedSprite = Required<Sprite>;

export interface Transition {
  type: "alpha" | "scale" | "move" | "color";
  time: number;
  value?: number;
  location?: [x: number, y: number];
  color?: number[];
}

export interface Layer {
  type: "text";
  id: number;

  value: string;
  color: number[];
  italic: boolean;

  width: number;
  height: number;
  textHeight: number;

  startTime: number;
  endTime: number;
  location: [x: number, y: number];

  transitions: Transition[];
}

export interface Keyframe {
  type: "code" | "effects";
  time: number;
  code?: string;
  highlight?: Record<number | string, boolean>;
}

export interface Token {
  id?: number;
  type: { keyword: string; label: string; binop: true };
  value: string;
  loc: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
  state?: string[];
  color?: number[];
  italic?: boolean;
  className?: string;
  items?: Token[];
}

export interface Project {
  keyframes: Keyframe[];
  totalTime: number;
  name: string;
  font: string;
  showBackground: boolean;
  animationDuration: number;
}

export type TimeAndValue = {
  start: number;
  end: number;
  from: number;
  to: number;
};

export type LayerWithMaps = Layer & {
  alphaMap: TimeAndValue[];
  scaleMap: TimeAndValue[];
  xMap: TimeAndValue[];
  yMap: TimeAndValue[];
  rMap: TimeAndValue[];
  gMap: TimeAndValue[];
  bMap: TimeAndValue[];
};

export type LayerAtTime = LayerWithMaps & {
  visible: boolean;
  opacity: number;
  scale: number;
};
