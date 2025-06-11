import useLanguageState from "@/hooks/state/useLanguageState";
import { getOrdinal } from "@/lib/utils";
import React from "react";
import { useSelector } from "react-redux";
import GroupQuestion from "../GroupQuestion";

const Groups = React.memo(({ data, indexes, index, group }) => {
  const { group_key, group_questions } = group || {};

  const { isEnglish } = useLanguageState();
  const { questions } = useSelector((state) => state.survey);

  const baseQuestionState = React.useMemo(() => {
    return questions?.[indexes[0]] || {};
  }, [questions, indexes]);

  const title = React.useMemo(() => {
    const prefix =
      baseQuestionState?.input_type === "number"
        ? getOrdinal(index + 1)
        : `${group_key}`;
    return `${prefix}. ${isEnglish ? "Group Information: Dependent Question" : "তথ্য গ্রুপ: প্রসঙ্গত প্রশ্ন"} (${baseQuestionState?.serial})`;
  }, [baseQuestionState, group_key, index, isEnglish]);

  return (
    <div className="rounded-lg bg-primary/10 p-2">
      <p className="mb-4 text-lg font-semibold text-primary">{title}</p>
      <div className="space-y-4">
        {group_questions?.map((gq, i) => (
          <GroupQuestion
            key={[...indexes, i].join("-")}
            data={data}
            question={gq}
            indexes={[...indexes, i]}
            index={i}
          />
        ))}
      </div>
    </div>
  );
});

Groups.displayName = "GroupQuestionsChunk";

export default Groups;
