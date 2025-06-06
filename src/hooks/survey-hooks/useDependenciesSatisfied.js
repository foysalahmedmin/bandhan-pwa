import { useMemo } from "react";

export const useDependenciesSatisfied = (dependencies, questions) => {
  return useMemo(() => {
    if (!dependencies?.length) return true;

    return dependencies.some((dep) => {
      const depQuestion = questions.find(
        (q) => q._id === dep.question.toString(),
      );
      if (!depQuestion) return false;

      if (dep.value === "{{anything}}") {
        return ![null, undefined, ""].includes(depQuestion?.value);
      }

      if (Array.isArray(depQuestion?.value)) {
        return depQuestion.value.includes(dep.value);
      }

      return depQuestion.value === dep.value;
    });
  }, [dependencies, questions]);
};
