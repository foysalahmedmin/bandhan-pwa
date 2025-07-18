import useLanguageState from "@/hooks/state/useLanguageState";
import { useDependenciesSatisfied } from "@/hooks/survey-hooks/useDependenciesSatisfied";
import { cn } from "@/lib/utils";
import { updateGroupQuestionValue } from "@/redux/slices/surveySlice";
import { interpolateText, processQuestionValue } from "@/utils/surveyUtils";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import QuestionInput from "../QuestionInput";

const GroupQuestion = React.memo(({ question, indexes, data }) => {
  const {
    isRequired,
    isTextOnly,
    isAllowSpecialCharacter,
    max_length,
    min_value,
    max_value,
    input_type,
    sequence_dependencies,
  } = question || {};
  const dispatch = useDispatch();
  const { isEnglish } = useLanguageState();
  const { questions } = useSelector((state) => state.survey);

  const baseQuestionState = React.useMemo(() => {
    return questions?.[indexes[0]] || {};
  }, [questions, indexes]);

  const groupState = React.useMemo(() => {
    return baseQuestionState?.groups?.[indexes[1]] || {};
  }, [baseQuestionState, indexes]);

  const { value } = React.useMemo(() => {
    return groupState?.group_questions?.[indexes[2]] || {};
  }, [groupState, indexes]);

  const dependenciesSatisfied = useDependenciesSatisfied(
    sequence_dependencies,
    [baseQuestionState, ...(groupState?.group_questions || [])],
    !!question?.isMultiDependency,
    [baseQuestionState],
  );

  const isVisible = React.useMemo(() => {
    return !question.isSequenceDependent || dependenciesSatisfied;
  }, [question, dependenciesSatisfied]);

  const questionText = React.useMemo(
    () => interpolateText(question.question, data),
    [question.question, data],
  );

  const handleValueChange = React.useCallback(
    (value) => {
      const processedValue = processQuestionValue(
        {
          input_type,
          isTextOnly,
          isAllowSpecialCharacter,
          max_length,
          min_value,
          max_value,
        },
        value,
      );
      dispatch(
        updateGroupQuestionValue({
          indexes,
          value: processedValue,
        }),
      );
    },
    [
      dispatch,
      indexes,
      input_type,
      isTextOnly,
      isAllowSpecialCharacter,
      max_length,
      min_value,
      max_value,
    ],
  );

  useEffect(() => {
    if (!isVisible && !!value) {
      dispatch(
        updateGroupQuestionValue({
          indexes,
          value: "",
        }),
      );
    }
  }, [dispatch, indexes, value, isVisible]);

  if (!isVisible) return null;

  const name = `question-${baseQuestionState.serial}-${groupState.key}-${question.serial}-${indexes.join("-")}`;

  return (
    <div
      className={cn("mb-6 rounded-lg p-4", {
        "border-l-4 border-l-primary/15 pl-3": question.isSequenceDependent,
      })}
    >
      <div className="mb-3">
        <p className="font-medium text-primary">
          {question.serial}. {questionText}
          {question.isRequired && <span className="ml-1 text-red-500">*</span>}
        </p>
        {question.note && (
          <small className="italic text-gray-500">{question.note}</small>
        )}
      </div>

      <QuestionInput
        question={question}
        value={value}
        onChange={handleValueChange}
        isRequired={isRequired}
        isEnglish={isEnglish}
        name={name}
      />
    </div>
  );
});

GroupQuestion.displayName = "GroupQuestion";

export default GroupQuestion;
