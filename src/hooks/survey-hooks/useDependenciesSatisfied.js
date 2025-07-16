import { useMemo } from "react";

export const useDependenciesSatisfied = (dependencies, questions, serial) => {
  return useMemo(() => {
    if (!dependencies?.length) return true;

    const requiredGroupMap = {}; // Grouped by required dependencies
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

      const isBeforeCurrent = Number(depQuestion.serial) < Number(serial);

      if (depQuestion.isRequired && isBeforeCurrent) {
        if (!requiredGroupMap[depQuestion._id]) {
          requiredGroupMap[depQuestion._id] = [];
        }
        requiredGroupMap[depQuestion._id].push(isSatisfied);
      } else {
        optionalResults.push(isSatisfied);
      }
    }

    // All required groups must have at least one satisfied dependency
    const allRequiredSatisfied = Object.values(requiredGroupMap).every(
      (group) => group.some(Boolean),
    );

    console.log(serial, requiredGroupMap, allRequiredSatisfied);

    if (Object.keys(requiredGroupMap).length > 0) {
      return allRequiredSatisfied;
    }

    // If no required dependencies, at least one optional must be satisfied
    return optionalResults.length > 0 ? optionalResults.some(Boolean) : false;
  }, [dependencies, questions, serial]);
};
