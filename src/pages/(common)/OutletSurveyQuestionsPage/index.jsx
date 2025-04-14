import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormControl } from "@/components/ui/FormControl";
import { Radio } from "@/components/ui/Radio";
import URLS from "@/constants/urls";
import useAuthenticationState from "@/hooks/state/useAuthenticationState";
import useLanguageState from "@/hooks/state/useLanguageState";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Question = ({ question, index, handleAddValue, questions }) => {
  console.log('question', { question, index, questions });
  const { isEnglish } = useLanguageState();

  const dependenciesSatisfied = useMemo(() => {
    return (
      question.dependencies?.some((dep) => {
        const depQuestion = questions.find(
          (q) => q._id === dep.question.toString(),
        );
        return depQuestion?.value === dep.value;
      }) ?? false
    );
  }, [question.dependencies, questions]);

  const isVisible = !question.isDependent || dependenciesSatisfied;
  const isRequired = question.isRequired && dependenciesSatisfied;

  console.log('dependenciesSatisfied', dependenciesSatisfied);

  const handleValueChange = (value) => {
    let processedValue = value;

    switch (question.input_type) {
      case "number":
        processedValue = Number(value);
        break;
      case "date":
        processedValue = new Date(value).toISOString();
        break;
      case "checkbox":
        processedValue = Array.isArray(value) ? value : [value];
        break;
      default:
        processedValue = value;
    }

    handleAddValue(processedValue, index);
  };

  console.log('isVisible', isVisible)

  if (!isVisible) return null;

  return (
    <div
      className={cn(`mb-6 rounded-lg border p-4`, {
        "border-l-4 border-primary pl-4": question.isDependent,
      })}
    >
      <div className="mb-3">
        <p className={`font-medium text-primary`}>
          {question.serial}. {question.question}
          {isRequired && <span className="ml-1 text-red-500">*</span>}
        </p>
        {question.note && (
          <small className="italic text-gray-500">{question.note}</small>
        )}
      </div>

      <div className="space-y-2">
        {["text", "number", "date"].includes(question.input_type) && (
          <FormControl
            type={question.input_type}
            value={question.value || ""}
            onChange={(e) => handleValueChange(e.target.value)}
            required={isRequired}
            placeholder={isEnglish ? "Enter your answer" : "আপনার উত্তর লিখুন"}
          />
        )}

        {question.input_type === "radio" && (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option.value} className="flex items-center gap-2">
                <Radio
                  checked={question.value === option.value}
                  onChange={() => handleValueChange(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        )}

        {question.input_type === "checkbox" && (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option.value} className="flex items-center gap-2">
                <Checkbox
                  checked={question.value?.includes(option.value)}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...(question.value || []), option.value]
                      : (question.value || []).filter(
                        (v) => v !== option.value,
                      );
                    handleValueChange(newValue);
                  }}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        )}

        {question.input_type === "select" && (
          <FormControl
            as="select"
            className="w-full rounded border p-2"
            value={question.value || ""}
            onChange={(e) => handleValueChange(e.target.value)}
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
        )}
      </div>
    </div>
  );
};

const OutletSurveyQuestionsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthenticationState();
  const { isEnglish } = useLanguageState();

  const [questions, setQuestions] = useState([]);
  const [successModal, setSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { outletId, outletCode, outletName, phase } = state || {};
  const phaseId = phase?._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          URLS.baseURL + `/api/outlet-survey/get-surveys`,
          {
            params: { phaseId, outletId },
            headers: { Authorization: user },
          },
        );

        console.log('data', data);

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
      } catch (error) {
        console.error("Error fetching surveys:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (phaseId && outletId) fetchData();
  }, [phaseId, outletId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = questions
        .filter((q) => q.value !== undefined && q.value !== null)
        .map((q) => ({
          user: user?.id,
          outlet: outletId,
          phase: phaseId,
          question: q._id,
          input_type: q.input_type,
          value: q.value,
          ...(q.input_type === "number" && { value_number: q.value }),
          ...(q.input_type === "date" && { value_date: q.value }),
          ...(q.input_type === "checkbox" && { value_array: q.value }),
        }));

      await axios.post(
        URLS.baseURL + "/api/outlet-survey/create-surveys",
        { surveys: payload },
        { headers: { Authorization: user } },
      );

      setSuccessModal(true);
    } catch (error) {
      console.error("Submission error:", error);
      alert(isEnglish ? "Submission failed" : "জমা দেওয়া ব্যর্থ হয়েছে");
    } finally {
      setIsLoading(false);
    }
  };

  const handleValueUpdate = (value, index) => {
    const updated = [...questions];
    updated[index].value = value;
    setQuestions(updated);
  };

  if (!phase || isLoading) {
    return <div>{isEnglish ? "Loading..." : "লোড হচ্ছে..."}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">{phase.name}</h1>

      <div className="mb-8 space-y-2 rounded-lg bg-gray-50 p-4">
        <div className="grid grid-cols-2 gap-4">
          <span className="font-medium">
            {isEnglish ? "Outlet Code" : "আউটলেট কোড"}
          </span>
          <span>{outletCode}</span>

          <span className="font-medium">
            {isEnglish ? "Outlet Name" : "আউটলেটের নাম"}
          </span>
          <span>{outletName}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <Question
            key={question._id}
            index={index}
            question={question}
            questions={questions}
            handleAddValue={handleValueUpdate}
          />
        ))}

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

      {successModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-8 text-center">
            <Check className="mx-auto mb-4 text-green-500" size={40} />
            <h2 className="mb-2 text-xl font-bold">
              {isEnglish
                ? "Submission Successful!"
                : "সফলভাবে জমা দেওয়া হয়েছে!"}
            </h2>
            <Button onClick={() => navigate(-1)}>
              {isEnglish ? "Return to Dashboard" : "ড্যাশবোর্ডে ফিরে যান"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutletSurveyQuestionsPage;
