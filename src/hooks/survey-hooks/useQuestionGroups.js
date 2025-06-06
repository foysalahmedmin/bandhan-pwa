import { isNumeric } from "@/utils/surveyUtils";
import { useMemo } from "react";

export const useQuestionGroups = (question, questions) => {
  return useMemo(() => {
    if (
      !question?.value ||
      (!isNumeric(question?.value) && !Array.isArray(question?.value))
    ) {
      return [];
    }

    if (!question?.question_group_logics?.length) return [];

    const group =
      questions?.filter((q) =>
        question.question_group_logics.some((d) => {
          if (d?.depended_question === q?._id && d?.value === "{{anything}}")
            return true;
          if (d?.depended_question === q?._id && d?.value === question?.value)
            return true;
          if (
            d?.depended_question === q?._id &&
            Array.isArray(question?.value)
          ) {
            return question.value.includes(d?.value);
          }
          return false;
        }),
      ) || [];

    if (isNumeric(question?.value)) {
      const count = Number(question.value);
      return Array.from({ length: count }, (_, i) => ({
        group_base_question: question._id,
        group_base_value: question.value,
        group_key: i + 1,
        group_index: i,
        group_questions: group,
      }));
    }

    if (Array.isArray(question?.value)) {
      return question.value.map((item, i) => ({
        group_base_question: question._id,
        group_base_value: question.value,
        group_key: item,
        group_index: i,
        group_questions: group,
      }));
    }

    return [];
  }, [
    question?._id,
    question?.value,
    question?.question_group_logics,
    questions,
  ]);
};
