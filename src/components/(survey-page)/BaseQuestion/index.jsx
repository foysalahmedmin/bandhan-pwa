import useLanguageState from "@/hooks/state/useLanguageState";
import { useDependenciesSatisfied } from "@/hooks/survey-hooks/useDependenciesSatisfied";
import { useQuestionGroups } from "@/hooks/survey-hooks/useQuestionGroups";
import {
  setQuestionGroups,
  updateQuestionValue,
} from "@/redux/slices/surveySlice";
import {
  areGroupsEqual,
  interpolateText,
  processQuestionValue,
} from "@/utils/surveyUtils";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Groups from "../Groups";
import QuestionInput from "../QuestionInput";

const BaseQuestion = React.memo(({ question, index, data }) => {
  const {
    _id,
    isRequired,
    isTextOnly,
    isAllowSpecialCharacter,
    max_length,
    min_value,
    max_value,
    input_type,
    sequence_dependencies,
    group_values,
  } = question || {};

  const dispatch = useDispatch();
  const { isEnglish } = useLanguageState();
  const { questions, initialQuestions } = useSelector((state) => state.survey);

  const { value, groups } = React.useMemo(() => {
    return questions?.[index] || {};
  }, [questions, index]);

  const dependenciesSatisfied = useDependenciesSatisfied(
    sequence_dependencies,
    questions,
    question?.serial,
  );

  const isVisible = React.useMemo(() => {
    const hasSequenceDependencies =
      question.isSequenceDependent && !dependenciesSatisfied;
    const hasGroupDependencies = question?.isGroupDependent;
    return !hasSequenceDependencies && !hasGroupDependencies;
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
      dispatch(updateQuestionValue({ index, value: processedValue }));
    },
    [
      dispatch,
      index,
      input_type,
      isTextOnly,
      isAllowSpecialCharacter,
      max_length,
      min_value,
      max_value,
    ],
  );

  const initialGroups = useQuestionGroups(
    { _id, group_values, value },
    initialQuestions,
  );

  useEffect(() => {
    if (!areGroupsEqual(groups, initialGroups)) {
      dispatch(setQuestionGroups({ index, groups: initialGroups }));
    }
  }, [index, initialGroups, dispatch]);

  useEffect(() => {
    if (!isVisible && !!value) {
      dispatch(updateQuestionValue({ index, value: "" }));
    }
  }, [dispatch, index, value, isVisible]);

  if (!isVisible) return null;

  const name = `question-${question?.serial}-${index}`;

  return (
    <div className="mb-6 space-y-4 rounded-lg p-4">
      <div className="space-y-2">
        <div className="mb-3">
          <p className="font-medium text-primary">
            {question.serial}. {questionText}
            {question.isRequired && (
              <span className="ml-1 text-red-500">*</span>
            )}
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

      {!!value && initialGroups?.length > 0 && (
        <div className="space-y-6 border border-primary p-4">
          {initialGroups?.map((g, idx) => (
            <Groups
              key={[index, idx].join("-")}
              data={data}
              indexes={[index, idx]}
              index={idx}
              group={g}
            />
          ))}
        </div>
      )}
    </div>
  );
});
BaseQuestion.displayName = "BaseQuestion";

export default BaseQuestion;
