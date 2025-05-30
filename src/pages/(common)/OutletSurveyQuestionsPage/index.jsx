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

const Question = ({
  question,
  index,
  handleAddValue,
  questions,
  data = {},
}) => {
  const { isEnglish } = useLanguageState();
  const dependenciesSatisfied = useMemo(() => {
    return (
      question.dependencies?.some((dep) => {
        const depQuestion = questions.find(
          (q) => q._id === dep.question.toString(),
        );

        if (dep.value === "{{anything}}") {
          return !!(
            depQuestion?.value != "" &&
            depQuestion?.value != null &&
            depQuestion?.value !== undefined
          );
        }
        if (Array.isArray(depQuestion?.value)) {
          return depQuestion?.value.some((val) => val === dep?.value);
        }
        return depQuestion?.value === dep.value;
      }) ?? false
    );
  }, [question.dependencies, questions]);

  const isVisible = !question.isDependent || dependenciesSatisfied;
  const isRequired = question.isRequired && dependenciesSatisfied;

  const question_text = question?.question?.replace(
    /{{\s*([\w.]+)\s*}}/g,
    (_, path) => {
      return path.split(".").reduce((obj, key) => obj?.[key], data) ?? "";
    },
  );
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

  if (!isVisible) return null;

  console.log(question?.value);

  return (
    <div
      className={cn(`mb-6 rounded-lg p-4`, {
        "border-l-4 border-l-primary/15 pl-3": question.isDependent,
      })}
    >
      <div className="mb-3">
        <p className={`font-medium text-primary`}>
          {question.serial}. {question_text}
          {isRequired && <span className="ml-1 text-red-500">*</span>}
        </p>
        {question.note && (
          <small className="italic text-gray-500">{question.note}</small>
        )}
      </div>

      <div className="space-y-2">
        {["text", "number"].includes(question.input_type) && (
          <FormControl
            type={question.input_type}
            value={question.value || ""}
            onChange={(e) => handleValueChange(e.target.value)}
            required={isRequired}
            placeholder={isEnglish ? "Enter your answer" : "আপনার উত্তর লিখুন"}
          />
        )}

        {question.input_type === "date" && (
          <FormControl
            type={"date"}
            value={
              question.value
                ? new Date(question.value).toISOString().split("T")[0]
                : ""
            }
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
  const { user, userInfo } = useAuthenticationState();
  const { isEnglish } = useLanguageState();

  const [questions, setQuestions] = useState([]);
  const [successModal, setSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { totalOutlets, outlet, phase } = state || {};
  const phaseId = phase?._id;
  const outletId = outlet?._id;
  const outletCode = outlet?.code;

  const data = {
    outlet,
    state,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          URLS.baseURL + `/api/outlet-survey/get-surveys`,
          {
            params: { phaseId: phaseId, outletId: outletId },
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
          user: userInfo?._id,
          outlet: outletId,
          outlet_code: outletCode,
          phase: phaseId,
          question: q._id,
          input_type: q.input_type,
          value: q.value,
          ...(q.input_type === "number" && { value_number: q.value }),
          ...(q.input_type === "date" && { value_date: q.value }),
          ...(q.input_type === "checkbox" && { value_array: q.value }),
        }));

      const res = await axios.post(
        URLS.baseURL + "/api/outlet-survey/create-surveys",
        { surveys: payload },
        { headers: { Authorization: user } },
      );

      console.log("Submission response:", res);
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
    return (
      <div className="container py-4">
        {isEnglish ? "Loading..." : "লোড হচ্ছে..."}
      </div>
    );
  }

  return (
    <main>
      <section className="py-4">
        <div className="container">
          <h1 className="mb-6 text-2xl font-bold">{phase?.name}</h1>

          {Object.keys(outlet || {})?.length > 0 && (
            <div className="space-y-2">
              <div className="grid cursor-pointer grid-cols-4 items-center gap-2">
                <span className="text-sm leading-none">
                  {isEnglish ? "Outlet Name" : "আউটলেট নাম"}
                </span>
                <FormControl
                  as="div"
                  className="pointer-events-none col-span-3 h-auto min-h-form-control justify-center text-center text-sm"
                >
                  {outlet?.name}
                </FormControl>
              </div>
              <div className="grid cursor-pointer grid-cols-4 items-center gap-2">
                <span className="text-sm leading-none">
                  {isEnglish ? "Outlet Code" : "আউটলেট কোড"}
                </span>
                <FormControl
                  as="div"
                  className="pointer-events-none col-span-3 h-auto min-h-form-control justify-center text-center text-sm"
                >
                  {outlet?.code}
                </FormControl>
              </div>
              <div className="grid cursor-pointer grid-cols-4 items-center gap-2">
                <span className="text-sm leading-none">
                  {isEnglish ? "Retailer Name" : "রিটেলার নাম"}
                </span>
                <FormControl
                  as="div"
                  className="pointer-events-none col-span-3 h-auto min-h-form-control justify-center text-center text-sm"
                >
                  {outlet?.retailer?.name}
                </FormControl>
              </div>
              <div className="grid cursor-pointer grid-cols-4 items-center gap-2">
                <span className="text-sm leading-none">
                  {isEnglish ? "Retailer Number" : "রিটেলার নাম্বার"}
                </span>
                <FormControl
                  as="div"
                  className="pointer-events-none col-span-3 h-auto min-h-form-control justify-center text-center text-sm"
                >
                  {outlet?.retailer?.phone}
                </FormControl>
              </div>
              <div className="grid cursor-pointer grid-cols-4 items-center gap-2">
                <span className="text-sm leading-none">
                  {isEnglish ? "Retailer Address" : "রিটেলার ঠিকানা"}
                </span>
                <FormControl
                  as="div"
                  className="pointer-events-none col-span-3 h-auto min-h-form-control justify-center text-center text-sm"
                >
                  {outlet?.retailer?.address}
                </FormControl>
              </div>
              <div className="grid cursor-pointer grid-cols-4 items-center gap-2">
                <span className="text-sm leading-none">
                  {isEnglish ? "Retailer Category" : "রিটেলার ক্যাটাগরি"}
                </span>
                <FormControl
                  as="div"
                  className="pointer-events-none col-span-3 h-auto min-h-form-control justify-center text-center text-sm"
                >
                  {outlet?.category}
                </FormControl>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="border p-2">
              {questions.map((question, index) => (
                <Question
                  key={question._id}
                  index={index}
                  data={data}
                  question={question}
                  questions={questions}
                  handleAddValue={handleValueUpdate}
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

          {successModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="rounded-lg bg-white p-8 text-center">
                <div className="mb-4">
                  <Check className="mx-auto mb-4 text-green-500" size={40} />
                  <h2 className="mb-2 text-xl font-bold">
                    {isEnglish
                      ? "Submission Successful!"
                      : "সফলভাবে জমা দেওয়া হয়েছে!"}
                  </h2>
                  <p className="">
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
                      Total Outlet:{" "}
                      <span className="font-bold">
                        {Number(totalOutlets || 0) || 0}
                      </span>
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
                        {Number(totalOutlets || 0) -
                          (phase?.completed_outlets + 1 || 0)}
                      </span>
                    </p>
                  </div>
                </div>
                <Button onClick={() => navigate(-1)}>
                  {isEnglish ? "Return to Dashboard" : "ড্যাশবোর্ডে ফিরে যান"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default OutletSurveyQuestionsPage;
