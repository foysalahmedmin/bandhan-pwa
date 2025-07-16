import { useMemo } from "react";

export const useDependenciesSatisfied = (
  dependencies,
  questions,
  isMultiDependency = false,
) => {
  return useMemo(() => {
    if (!dependencies?.length) return true;

    const requiredGroupMap = {};
    const optionalResults = [];

    for (const dep of dependencies) {
      const depQuestion = questions.find(
        (q) => q._id === dep.question?.toString(),
      );
      if (!depQuestion) continue;

      let isSatisfied = false;

      if (dep.value === "{{anything}}") {
        isSatisfied = ![null, undefined, ""].includes(depQuestion.value);
      } else if (Array.isArray(depQuestion.value)) {
        isSatisfied = depQuestion.value.includes(dep.value);
      } else {
        isSatisfied = depQuestion.value === dep.value;
      }

      if (
        depQuestion.isRequired &&
        depQuestion.isVisible &&
        isMultiDependency
      ) {
        if (!requiredGroupMap[depQuestion._id]) {
          requiredGroupMap[depQuestion._id] = [];
        }
        requiredGroupMap[depQuestion._id].push(isSatisfied);
      } else {
        optionalResults.push(isSatisfied);
      }
    }

    const allRequiredSatisfied = Object.values(requiredGroupMap).every(
      (group) => group.some(Boolean),
    );

    if (Object.keys(requiredGroupMap).length > 0) {
      return allRequiredSatisfied;
    }

    // If no required dependencies, at least one optional must be satisfied
    return optionalResults.length > 0 ? optionalResults.some(Boolean) : false;
  }, [dependencies, questions, isMultiDependency]);
};
