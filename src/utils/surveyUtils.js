export const isNumeric = (value) => !isNaN(value) && !isNaN(parseFloat(value));

export const interpolateText = (text, data) => {
  if (!text) return "";
  return text.replace(/{{\s*([\w.]+)\s*}}/g, (_, path) => {
    return path.split(".").reduce((obj, key) => obj?.[key], data) ?? "";
  });
};

export const processQuestionValue = (info, value) => {
  const {
    input_type,
    isTextOnly,
    isAllowSpecialCharacter,
    max_length,
    min_value,
    max_value,
  } = info || {};
  switch (input_type) {
    case "text":
    case "textarea": {
      let processed = value;
      if (isTextOnly) processed = processed.replace(/[^a-zA-Z ]/g, "");
      if (!isTextOnly && !isAllowSpecialCharacter) {
        processed = processed.replace(/[^a-zA-Z0-9 ]/g, "");
      }
      if (typeof max_length === "number") {
        processed = processed.slice(0, max_length);
      }
      return processed;
    }
    case "number": {
      if (["", null, undefined].includes(value)) return "";
      const numValue = Number(value);
      if (typeof min_value === "number" && numValue < min_value) return "";
      if (typeof max_value === "number" && numValue > max_value)
        return max_value;
      return numValue;
    }
    case "number-range":
      return Array.isArray(value)
        ? [Number(value[0]), Number(value[1])]
        : value;
    case "date":
      return new Date(value).toISOString();
    case "date-range":
      return Array.isArray(value)
        ? [new Date(value[0]).toISOString(), new Date(value[1]).toISOString()]
        : value;
    case "checkbox":
      return Array.isArray(value) ? value : [value];
    default:
      return value;
  }
};

export const areGroupsEqual = (a = [], b = []) => {
  if (a.length !== b.length) return false;
  return a.every((group, i) => {
    return (
      group.key === b[i]?.key &&
      group.questions?.length === b[i]?.questions?.length &&
      group.questions.every((q, j) => q._id === b[i].questions?.[j]?._id)
    );
  });
};
