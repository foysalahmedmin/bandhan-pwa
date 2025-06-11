import { isNumeric } from "@/utils/surveyUtils";
import { useMemo } from "react";

export const useQuestionGroups = (info, questions) => {
  const { _id, value, group_values } = info || {};
  return useMemo(() => {
    if (!value || (!isNumeric(value) && !Array.isArray(value))) {
      return [];
    }

    if (!group_values?.length) return [];

    const group_questions =
      questions?.filter((q) =>
        group_values?.some((d) => {
          if (d?.depended_question === q?._id && d?.value === "{{anything}}")
            return true;
          if (d?.depended_question === q?._id && d?.value === value)
            return true;
          if (d?.depended_question === q?._id && Array.isArray(value)) {
            return value?.includes(d?.value);
          }
          return false;
        }),
      ) || [];

    if (isNumeric(value)) {
      const count = Number(value);
      return Array.from({ length: count }, (_, i) => ({
        group_base_question: _id,
        group_base_value: value,
        group_key: i + 1,
        group_index: i,
        group_questions: group_questions,
      }));
    }

    if (Array.isArray(value)) {
      return value.map((item, i) => ({
        group_base_question: _id,
        group_base_value: value,
        group_key: item,
        group_index: i,
        group_questions: group_questions,
      }));
    }

    return [];
  }, [_id, value, group_values, questions]);
};
