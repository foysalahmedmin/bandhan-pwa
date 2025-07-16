export const isNumeric = (value) => !isNaN(value) && !isNaN(parseFloat(value));

export const interpolateText = (text, data) => {
  if (!text) return "";
  return text.replace(/{{\s*([\w.]+)\s*}}/g, (_, path) => {
    return path.split(".").reduce((obj, key) => obj?.[key], data) ?? "";
  });
};

export const parseToFormattedInput = (value, type = "datetime-local") => {
  if (!value) return "";

  let date;

  // If input is a string in HH:mm format
  if (typeof value === "string" && /^\d{2}:\d{2}$/.test(value)) {
    const [hours, minutes] = value.split(":").map(Number);
    date = new Date();
    date.setHours(hours, minutes, 0, 0);
  } else {
    date = new Date(value);
  }

  if (isNaN(date)) return "";

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  switch (type) {
    case "date":
      return `${year}-${month}-${day}`;
    case "time":
      return `${hours}:${minutes}`;
    case "datetime-local":
    default:
      return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
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
      return new Date(value);
    case "date-range":
      return Array.isArray(value)
        ? [new Date(value[0]), new Date(value[1])]
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
      group?.group_key === b[i]?.group_key &&
      group?.group_questions?.length === b?.[i]?.group_questions?.length &&
      group?.group_questions?.every(
        (q, j) => q._id === b?.[i]?.group_questions?.[j]?._id,
      )
    );
  });
};
