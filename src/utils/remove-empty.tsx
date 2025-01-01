export const removeEmpty = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(removeEmpty).filter((item) => item !== undefined);
  } else if (obj && typeof obj === "object") {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !(
          typeof value === "object" &&
          Object.keys(removeEmpty(value)).length === 0
        )
      ) {
        acc[key] = removeEmpty(value);
      }
      return acc;
    }, {} as any);
  }
  return obj;
};
