import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormControl } from "@/components/ui/FormControl";
import { Radio } from "@/components/ui/Radio";
import URLS from "@/constants/urls";
import useAuthenticationState from "@/hooks/state/useAuthenticationState";
import useLanguageState from "@/hooks/state/useLanguageState";

import { cn, getOrdinal } from "@/lib/utils";
import axios from "axios";
import { Check } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ==============================
// Helper Functions
// ==============================
const isNumeric = (value) => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};

const interpolateText = (text, data) => {
  return text?.replace(/{{\s*([\w.]+)\s*}}/g, (_, path) => {
    return path.split(".").reduce((obj, key) => obj?.[key], data) ?? "";
  });
};

const processQuestionValue = (question, value) => {
  switch (question.input_type) {
    case "text":
    case "textarea": {
      let processed = value;
      if (question.isTextOnly) processed = processed.replace(/[^a-zA-Z ]/g, "");
      if (!question.isTextOnly && !question.isAllowSpecialCharacter) {
        processed = processed.replace(/[^a-zA-Z0-9 ]/g, "");
      }
      if (typeof question?.max_length === "number") {
        processed = processed.slice(0, question.max_length);
      }
      return processed;
    }

    case "number": {
      if (["", null, undefined].includes(value)) return "";
      const numValue = Number(value);
      if (
        typeof question?.min_value === "number" &&
        numValue < question.min_value
      )
        return "";
      if (
        typeof question?.max_value === "number" &&
        numValue > question.max_value
      )
        return question.max_value;
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

const useSequenceDependenciesSatisfied = (dependencies, questions) => {
  return useMemo(() => {
    return (
      dependencies?.some((dep) => {
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
      }) ?? false
    );
  }, [dependencies, questions]);
};

const useGroupQuestions = (question, questions) => {
  const [groupQuestions, setGroupQuestions] = useState([]);

  useEffect(() => {
    if (
      !question?.value ||
      (!isNumeric(question?.value) && !Array.isArray(question?.value))
    ) {
      setGroupQuestions([]);
      return;
    }

    if (question?.question_group_logics?.length > 0) {
      const groupChunk = questions?.filter((q) =>
        question?.question_group_logics?.some((d) => {
          if (d?.depended_question === q?._id && d?.value === "{{anything}}") {
            return true;
          }

          if (d?.depended_question === q?._id && d?.value === question?.value) {
            return true;
          }

          if (
            d?.depended_question === q?._id &&
            Array.isArray(question?.value)
          ) {
            return question?.value.includes(d?.value);
          }
        }),
      );

      if (isNumeric(question?.value)) {
        const count = Number(question.value);
        const chunks = Array.from({ length: count }, (_, i) => ({
          key: i + 1,
          questions: groupChunk ?? [],
        }));
        setGroupQuestions(chunks);
      } else if (Array.isArray(question?.value)) {
        const chunks = question.value.map((item) => ({
          key: item,
          questions: groupChunk ?? [],
        }));
        setGroupQuestions(chunks);
      }
    }
  }, [question, questions]);

  return groupQuestions;
};

// ==============================
// Input Components
// ==============================
const RangeInput = ({
  question,
  value,
  onChange,
  isRequired,
  isEnglish,
  prefix,
}) => {
  const handleChange = (val, isStart) => {
    const current = Array.isArray(value) ? [...value] : ["", ""];
    current[isStart ? 0 : 1] = val;
    onChange(current);
  };

  return (
    <div className="flex items-center gap-2">
      <FormControl
        name={`${prefix}-start`}
        type={question.input_type === "date-range" ? "date" : "number"}
        value={Array.isArray(value) ? value[0] || "" : ""}
        onChange={(e) => handleChange(e.target.value, true)}
        required={isRequired}
        placeholder={isEnglish ? "Start value" : "শুরুর মান"}
      />
      <span className="text-gray-500">{isEnglish ? "to" : "থেকে"}</span>
      <FormControl
        name={`${prefix}-end`}
        type={question.input_type === "date-range" ? "date" : "number"}
        value={Array.isArray(value) ? value[1] || "" : ""}
        onChange={(e) => handleChange(e.target.value, false)}
        required={isRequired}
        placeholder={isEnglish ? "End value" : "শেষ মান"}
      />
    </div>
  );
};

const OptionInput = ({ question, name, value, onChange, isRequired, type }) => (
  <div className="space-y-2">
    {question.options?.map((option) => (
      <label key={option.value} className="flex items-center gap-2">
        {type === "radio" ? (
          <Radio
            name={name}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            required={!value && isRequired}
          />
        ) : (
          <Checkbox
            name={name}
            checked={value?.includes(option.value)}
            onChange={(e) => {
              const newValue = e.target.checked
                ? [...(value || []), option.value]
                : (value || []).filter((v) => v !== option.value);
              onChange(newValue);
            }}
            required={!(value?.length > 0) && isRequired}
          />
        )}
        <span>{option.label}</span>
      </label>
    ))}
  </div>
);

const QuestionInput = ({
  question,
  value,
  onChange,
  isRequired,
  isEnglish,
  name,
}) => {
  const commonProps = {
    value: value || "",
    onChange: (e) => onChange(e.target.value),
    required: isRequired,
    placeholder: isEnglish ? "Enter your answer" : "আপনার উত্তর লিখুন",
  };

  switch (question.input_type) {
    case "text":
    case "email":
      return (
        <FormControl name={name} type={question.input_type} {...commonProps} />
      );

    case "textarea":
      return (
        <FormControl
          name={name}
          as="textarea"
          rows={4}
          className="h-[5rem] resize-y items-start py-1"
          {...commonProps}
        />
      );

    case "number":
      return (
        <FormControl
          name={name}
          type="number"
          {...commonProps}
          onInput={(e) => {
            const numValue = Number(e.target.value);
            if (question.max_value && numValue > question.max_value) {
              e.target.value = question.max_value;
            }
            if (question.min_value && numValue < question.min_value) {
              e.target.value = "";
            }
          }}
        />
      );

    case "number-range":
    case "date-range":
      return (
        <RangeInput
          question={question}
          value={value}
          onChange={onChange}
          isRequired={isRequired}
          isEnglish={isEnglish}
          prefix={name}
        />
      );

    case "date":
      return (
        <FormControl
          name={name}
          type="date"
          value={value ? new Date(value).toISOString().split("T")[0] : ""}
          {...commonProps}
        />
      );

    case "radio":
    case "checkbox":
      return (
        <OptionInput
          name={name}
          question={question}
          value={value}
          onChange={onChange}
          isRequired={isRequired}
          type={question.input_type}
        />
      );

    case "select":
      return (
        <FormControl
          name={name}
          as="select"
          className="w-full rounded border p-2"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          required={isRequired}
        >
          <option value="">
            {isEnglish ? "Select an option" : "একটি অপশন নির্বাচন করুন"}
          </option>
          {question.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </FormControl>
      );

    default:
      return null;
  }
};

// ==============================
// Question Components
// ==============================
const BaseQuestion = ({
  question,
  valuelessQuestions,
  questions,
  data,
  onValueChange,
}) => {
  const { isEnglish } = useLanguageState();
  const dependenciesSatisfied = useSequenceDependenciesSatisfied(
    question.dependencies,
    questions,
  );
  const groupQuestions = useGroupQuestions(question, valuelessQuestions);

  const isVisible = useMemo(() => {
    const hasDependencies =
      question.isSequenceDependent && !dependenciesSatisfied;
    const hasBaseDependencies = question?.isGroupDependent;
    return !hasDependencies && !hasBaseDependencies;
  }, [question, dependenciesSatisfied]);

  const questionText = useMemo(
    () => interpolateText(question.question, data),
    [question.question, data],
  );

  const name = `question-${question.serial}`;

  const handleValueChange = (value) => {
    onValueChange(processQuestionValue(question, value));
  };

  if (!isVisible) return null;

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
          value={question.value}
          onChange={handleValueChange}
          isRequired={question.isRequired}
          isEnglish={isEnglish}
          name={name}
        />
      </div>

      {question?.value && groupQuestions.length > 0 && (
        <div className="space-y-6 border border-primary p-4">
          {groupQuestions.map((gq, idx) => (
            <GroupQuestionsChunk
              key={gq.key}
              baseIndex={question._id}
              index={idx}
              question={question}
              questions={gq?.questions ?? []}
              data={data}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const GroupQuestion = ({
  baseQuestion,
  question,
  baseIndex,
  groupIndex,
  index,
  onValueChange,
  questions,
  data,
}) => {
  const { isEnglish } = useLanguageState();
  const dependenciesSatisfied = useSequenceDependenciesSatisfied(
    question.dependencies,
    [baseQuestion, ...questions],
  );

  const isVisible = useMemo(() => {
    return !question.isSequenceDependent || dependenciesSatisfied;
  }, [question, dependenciesSatisfied]);

  const questionText = useMemo(
    () => interpolateText(question.question, data),
    [question.question, data],
  );

  const name = `question-${question.serial}-${baseIndex}-${groupIndex}-${index}`;

  const handleValueChange = (value) => {
    onValueChange(processQuestionValue(question, value), index);
  };

  if (!isVisible) return null;

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
        value={question.value}
        onChange={handleValueChange}
        isRequired={question.isRequired}
        isEnglish={isEnglish}
        name={name}
      />
    </div>
  );
};

const GroupQuestionsChunk = ({
  baseIndex,
  index,
  key,
  question,
  questions: initialQuestions,
  data,
}) => {
  const [questions, setQuestions] = useState([...(initialQuestions ?? [])]);

  const handleValueUpdate = useCallback((value, idx) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[idx].value = value;
      return updated;
    });
  }, []);

  return (
    <div className="bg-primary/10 p-2">
      <p className="mb-4 text-lg font-semibold text-primary">
        {question?.input_type === "number" ? getOrdinal(index + 1) : key}.{" "}
        {`তথ্য গ্রুপ: প্রসঙ্গত প্রশ্ন (${question?.serial})`}
      </p>
      <div className="space-y-4">
        {questions.map((q, i) => (
          <GroupQuestion
            key={i}
            baseQuestion={question}
            question={q}
            baseIndex={baseIndex}
            groupIndex={index}
            groupKey={key}
            index={i}
            onValueChange={handleValueUpdate}
            questions={questions}
            data={data}
          />
        ))}
      </div>
    </div>
  );
};

// ==============================
// Main Page Component
// ==============================
const OutletSurveyQuestionsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, userInfo } = useAuthenticationState();
  const { isEnglish } = useLanguageState();

  const [valuelessQuestions, setValuelessQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { totalOutlets, outlet, phase } = state || {};
  const phaseId = phase?._id;
  const outletId = outlet?._id;
  const outletCode = outlet?.code;

  const data = useMemo(() => ({ outlet, state }), [outlet, state]);

  useEffect(() => {
    const fetchSurveyData = async () => {
      if (!phaseId || !outletId) return;

      try {
        const { data } = await axios.get(
          `${URLS.baseURL}/api/outlet-survey/get-surveys`,
          {
            params: { phaseId, outletId },
            headers: { Authorization: user },
          },
        );

        const mergedQuestions =
          phase?.questions?.map((q) => {
            const survey = data.data.find((s) => s.question._id === q._id);
            return {
              ...q,
              value: survey?.value,
              value_text: survey?.value_text,
              value_number: survey?.value_number,
              value_date: survey?.value_date,
              value_array: survey?.value_array || [],
            };
          }) || [];

        setQuestions(mergedQuestions);
        setValuelessQuestions(mergedQuestions);
      } catch (error) {
        console.error("Error fetching surveys:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurveyData();
  }, [phaseId, outletId, user, phase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = questions
        .filter((q) => q.value !== undefined && q.value !== null)
        .map((q) => ({
          user: userInfo?._id,
          outlet: outletId,
          outlet_code: outletCode,
          phase: phaseId,
          question: q._id,
          input_type: q.input_type,
          value: q.value,
          ...(q.input_type === "number" && { value_number: q.value }),
          ...(q.input_type === "date" && { value_date: q.value }),
          ...(["checkbox", "number-range", "date-range"].includes(
            q.input_type,
          ) && {
            value_array: q.value,
          }),
        }));

      await axios.post(
        `${URLS.baseURL}/api/outlet-survey/create-surveys`,
        { surveys: payload },
        { headers: { Authorization: user } },
      );

      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Submission error:", error);
      alert(isEnglish ? "Submission failed" : "জমা দেওয়া ব্যর্থ হয়েছে");
    } finally {
      setIsLoading(false);
    }
  };

  const handleValueUpdate = useCallback((value, index) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index].value = value;
      return updated;
    });
  }, []);

  if (!phase || isLoading) {
    return (
      <div className="container py-4">
        {isEnglish ? "Loading..." : "লোড হচ্ছে..."}
      </div>
    );
  }

  const outletFields = [
    { label: "Outlet Name", value: outlet?.name },
    { label: "Outlet Code", value: outlet?.code },
    { label: "Retailer Name", value: outlet?.retailer?.name },
    { label: "Retailer Number", value: outlet?.retailer?.phone },
    { label: "Retailer Address", value: outlet?.retailer?.address },
    { label: "Retailer Category", value: outlet?.category },
  ];

  return (
    <main>
      <section className="py-4">
        <div className="container">
          <h1 className="mb-6 text-2xl font-bold">{phase?.name}</h1>

          {outlet && (
            <div className="space-y-2">
              {outletFields.map((field, idx) => (
                <div key={idx} className="grid grid-cols-4 items-center gap-2">
                  <span className="text-sm leading-none">
                    {isEnglish ? field.label : field.label}
                  </span>
                  <FormControl
                    as="div"
                    className="pointer-events-none col-span-3 h-auto min-h-form-control justify-center text-center text-sm"
                  >
                    {field.value}
                  </FormControl>
                </div>
              ))}
            </div>
          )}

          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="border border-primary p-2">
              {questions.map((question, index) => (
                <BaseQuestion
                  key={question._id}
                  question={question}
                  index={index}
                  valuelessQuestions={valuelessQuestions}
                  questions={questions}
                  data={data}
                  onValueChange={(value) => handleValueUpdate(value, index)}
                />
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <Button type="submit" isLoading={isLoading}>
                {isLoading
                  ? isEnglish
                    ? "Saving..."
                    : "সেভ হচ্ছে..."
                  : isEnglish
                    ? "Save Survey"
                    : "সার্ভে সেভ করুন"}
              </Button>
            </div>
          </form>

          {isSuccessModalOpen && (
            <SuccessModal
              {...{
                isEnglish,
                phase,
                totalOutlets,
                navigate,
              }}
            />
          )}
        </div>
      </section>
    </main>
  );
};

const SuccessModal = ({ isEnglish, phase, totalOutlets, navigate }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="rounded-lg bg-white p-8 text-center">
      <div className="mb-4">
        <Check className="mx-auto mb-4 text-green-500" size={40} />
        <h2 className="mb-2 text-xl font-bold">
          {isEnglish ? "Submission Successful!" : "সফলভাবে জমা দেওয়া হয়েছে!"}
        </h2>
        <p>
          <p>Last Submission Date: </p>
          <span className="font-bold">
            {new Date(phase?.end_date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </p>
        <div className="mt-2 flex items-center gap-2">
          <p className="text-sm font-medium">
            Total Outlet: <span className="font-bold">{totalOutlets || 0}</span>
          </p>
          <div className="w-1 self-stretch bg-border" />
          <p className="text-sm font-medium">
            Completed:{" "}
            <span className="font-bold">
              {phase?.completed_outlets + 1 || 0}
            </span>
          </p>
          <div className="w-1 self-stretch bg-border" />
          <p className="text-sm font-medium">
            Incomplete:{" "}
            <span className="font-bold">
              {(totalOutlets || 0) - (phase?.completed_outlets + 1 || 0)}
            </span>
          </p>
        </div>
      </div>
      <Button onClick={() => navigate(-1)}>
        {isEnglish ? "Return to Dashboard" : "ড্যাশবোর্ডে ফিরে যান"}
      </Button>
    </div>
  </div>
);

export default OutletSurveyQuestionsPage;
