import { createComponents } from "./create-components";
import { createPalette } from "./create-pallete";
import { createShadows } from "./create-shadow";

export const createOptions = ({
  colorPreset,
  contrast,
}: {
  colorPreset: string;
  contrast: string;
}) => {
  const palette = createPalette({ colorPreset, contrast });
  const components = createComponents();
  const shadows = createShadows();

  return {
    components,
    palette,
    shadows,
  };
};
