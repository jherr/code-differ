import { createContext, useContext } from "react";

import { Layer } from "engine";

export interface AnimatorUIContextValue {
  sendToAfterEffects?: (data: {
    compName: string;
    rectangles: {
      time: number;
      size: number[];
      anchor: number[];
    }[];
    fontRegular: string;
    fontItalic: string;
    fontSize: number;
    totalTime: number;
    extents: number[];
    layers: Layer[];
  }) => Promise<void>;
}

export const AnimatorUIContext = createContext<AnimatorUIContextValue>({});

export const AnimatorUIProvider = ({
  children,
  options,
}: {
  children: React.ReactNode;
  options: AnimatorUIContextValue;
}) => {
  return (
    <AnimatorUIContext.Provider value={options}>
      {children}
    </AnimatorUIContext.Provider>
  );
};

export const useAnimatorUI = () => useContext(AnimatorUIContext);
