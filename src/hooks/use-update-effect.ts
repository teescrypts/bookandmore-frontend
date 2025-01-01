import { useEffect, useRef, EffectCallback, DependencyList } from "react";

/**
 * A custom useEffect hook that only triggers on updates, not on initial mount
 * @param {Function} effect The effect function to run on updates
 * @param {Array<any>} dependencies The list of dependencies for the effect
 */
export const useUpdateEffect = (
  effect: EffectCallback,
  dependencies: DependencyList = []
) => {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};
