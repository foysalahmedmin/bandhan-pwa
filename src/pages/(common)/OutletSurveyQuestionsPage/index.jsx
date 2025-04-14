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
import { useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Question = ({ question, index, subindex, handleAddValue, questions }) => {
  const allDependenciesSatisfied =
    question?.dependencies?.every((d) =>
      questions.some((q) => q._id === d.questionId && q.value === d.option),
    ) ?? true;

  const isIndependent =
    !question?.dependencies?.length || allDependenciesSatisfied;

  const isRequired = (question?.isRequired && !isIndependent) || false;

  return (
    <div
      key={question._id}
      className={cn("mb-6 rounded-lg border p-4", {
        "mt-4 border-l-4 border-primary/50 pl-4": question?.isDependent,
        hidden: question?.isDependent && !isIndependent,
      })}
    >
      <div className="mb-3">
        <p
          className={cn(
            "mb-1 font-medium text-gray-800",
            isRequired && "font-semibold",
          )}
        >
          {question?.serial}. {question?.question}
          {question?.isRequired && <span className="ml-1 text-red-500">*</span>}
        </p>
        {question?.note && (
          <small className="italic text-gray-500">{question.note}</small>
        )}
      </div>

      <div className="space-y-2">
        {question?.input_type === "text" && (
          <FormControl
            type="text"
            name={`question-${question._id}`}
            placeholder="Enter your answer"
            value={question?.value || null}
            required={isRequired || false}
            onChange={(e) => handleAddValue(e.target.value, index, subindex)}
          />
        )}

        {question?.input_type === "number" && (
          <FormControl
            type="number"
            name={`question-${question._id}`}
            placeholder="Enter your answer"
            value={question?.value || null}
            required={isRequired || false}
            onChange={(e) => handleAddValue(e.target.value, index, subindex)}
          />
        )}

        {question?.input_type === "date" && (
          <FormControl
            type="date"
            name={`question-${question._id}`}
            placeholder="Enter your answer"
            value={question?.value || null}
            required={isRequired || false}
            onChange={(e) => handleAddValue(e.target.value, index, subindex)}
          />
        )}

        {question?.input_type === "radio" && (
          <div className="space-y-2">
            {question?.options.map((option, optIndex) => {
              return (
                <label
                  key={`${question._id}-${optIndex}`}
                  className="flex cursor-pointer items-center space-x-2"
                >
                  <Radio
                    type="radio"
                    name={`question-${question._id}`}
                    className="h-4 w-4 cursor-pointer border-accent"
                    value={option?.value}
                    required={(isRequired && !question?.value) || false}
                    checked={question?.value === option?.value}
                    onChange={(e) => handleAddValue(e.target.value, index)}
                  />
                  <span className="text-gray-700">{option?.label}</span>
                </label>
              );
            })}
          </div>
        )}

        {(question?.input_type === "checkbox" ||
          question?.input_type === "select") && (
          <div className="space-y-2">
            {question.options.map((option, optIndex) => {
              const values = question?.value || [];

              return (
                <label
                  key={`${question._id}-${optIndex}`}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    type="checkbox"
                    name={`question-${question._id}`}
                    className="h-4 w-4 cursor-pointer border-accent"
                    value={option?.value}
                    required={
                      (isRequired &&
                        !question?.value &&
                        !question?.value?.length) ||
                      false
                    }
                    checked={values.includes(option?.value)}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...values, option?.value]
                        : values.filter((v) => v !== option?.value);

                      handleAddValue(newValues, index);
                    }}
                  />
                  <span className="text-gray-700">{option?.label}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const OutletSurveyQuestionsPage = () => {
  const routeLocation = useLocation();
  const navigate = useNavigate();
  const { user, userInfo } = useAuthenticationState();

  const { outletId, outletCode, outletName, phase } =
    routeLocation?.state || {};
  const { _id, name, questions: phase_questions } = phase || {};

  const { isEnglish } = useLanguageState();

  const [questions, setQuestions] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [successModal, setSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setQuestions(phase_questions || []);
  }, [phase_questions]);

  useLayoutEffect(() => {
    const getSurveys = async () => {
      {
        setIsLoading(true);
        try {
          if (!_id || !outletId) return;
          const settings = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: user,
            },
          };

          const response = await fetch(
            URLS.baseURL +
              `/api/outlet-survey/get-surveys?phaseId=${_id}&outletId=${outletId}`,
            settings,
          );
          const data = await response.json();
          if (response?.status === 200) {
            setSurveys(data?.data);
          } else {
            // alert("Error", resData?.message);
          }
        } catch (error) {
          console.error("Error", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    getSurveys();
  }, [user, _id, outletId]);

  useEffect(() => {
    if (surveys?.length > 0) {
      const questions = phase_questions?.map((q) => {
        const survey = surveys.find((s) => s.question === q._id);
        return {
          ...q,
          ...((survey?.value !== undefined || survey?.value !== null) && {
            value: survey?.value,
          }),
          ...((survey?.value_number !== undefined ||
            survey?.value_number !== null) && {
            value_number: survey?.value_number,
          }),
          ...(survey?.value_text && { value_text: survey?.value_text }),
          ...(survey?.value_date && { value_date: survey?.value_date }),
          ...(survey?.value_array && { value_array: survey?.value_array }),
        };
      });
      setQuestions(questions);
    }
  }, [surveys]);

  const handleAddValue = (value, index) => {
    const newQuestions = [...questions];
    const targetQuestion = newQuestions[index];

    switch (targetQuestion?.input_type) {
      case "text":
      case "radio":
      case "select":
        targetQuestion.value_text = value;
        targetQuestion.value = value;
        break;
      case "number":
        targetQuestion.value_number = +value;
        targetQuestion.value = +value;
        break;
      case "date":
        targetQuestion.value_date = value;
        targetQuestion.value = value;
        break;
      case "checkbox":
        targetQuestion.value_array = value;
        targetQuestion.value = value;
        break;
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const surveys = questions.reduce((acc, q) => {
        if (q?.value === undefined || q?.value === null) return acc;

        const item = {
          user: userInfo?._id,
          outlet: outletId,
          phase: _id,
          question: q._id,
          input_type: q.input_type,
          value: q.value,
        };

        if (q.value_number !== undefined) item.value_number = q.value_number;
        if (typeof q.value_text === "string" && q.value_text.trim() !== "")
          item.value_text = q.value_text;
        if (q.value_date) item.value_date = q.value_date;
        if (Array.isArray(q.value_array) && q.value_array.length)
          item.value_array = q.value_array;

        acc.push(item);
        return acc;
      }, []);

      console.log("payload", surveys);

      if (surveys.length === 0) {
        alert("No valid responses to submit.");
        return;
      }

      const url = `${URLS.baseURL}/api/outlet-survey/create-surveys`;
      const response = await axios.post(url, { surveys: surveys });

      console.log("response", response);
      if (response.status === 200) setSuccessModal(true);
    } catch (err) {
      console.error(
        "Error submitting data:",
        err.response?.data || err.message,
      );
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="py-4">
        <div className="container space-y-4">
          <div className="space-y-2">
            <h3>{name}</h3>
            <div className="grid cursor-pointer grid-cols-4 items-center gap-2">
              <span className="text-sm leading-none">
                {isEnglish ? "Outlet Name" : "আউটলেট নাম"}
              </span>
              <FormControl
                as="div"
                className="pointer-events-none col-span-3 h-auto min-h-form-control justify-center text-center text-sm"
              >
                {outletName}
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
                {outletCode}
              </FormControl>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            {/* PCM Section */}
            <div className="rounded-md border border-primary">
              <strong className="block w-full bg-primary py-2 text-center font-semibold text-primary-foreground">
                {isEnglish ? "Survy Questions" : "সার্ভিস প্রশ্নসমূহ"}
              </strong>
              <div className="p-2">
                <div className="grid grid-cols-1">
                  {questions?.map((question, index) => (
                    <Question
                      key={index}
                      index={index}
                      question={question}
                      handleAddValue={handleAddValue}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              {surveys?.length > 0 ? (
                <Button disabled={true}>
                  <span>{isEnglish ? "Update" : "অপডেট"}</span>
                </Button>
              ) : (
                <Button type="submit" isLoading={isLoading}>
                  <span>{isEnglish ? "Submit" : "সাবমিট"}</span>
                </Button>
              )}
            </div>

            {/* Success Modal */}
            {successModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="m-4 w-full max-w-md rounded-lg bg-white p-8">
                  <div className="text-center">
                    <Check className="mx-auto mb-4 h-16 w-16 text-green-500" />
                    <span className="mb-2 text-xl font-bold">
                      {isEnglish ? "Submit Success" : "সাবমিট সাকসেস"}
                    </span>
                    <p className="mb-4 text-gray-600">
                      {isEnglish
                        ? "Your feedback has been successfully submitted."
                        : "আপনার ফিডব্যাক সফলভাবে জমা দেওয়া হয়েছে."}
                    </p>
                    <button
                      className="hover:bg-primary-dark rounded-lg bg-primary px-4 py-2 text-white transition-colors"
                      onClick={() => {
                        setSuccessModal(false);
                        navigate(`/`, {
                          replace: true,
                        });
                      }}
                    >
                      {isEnglish ? "Close" : "বন্ধ করুন"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};

export default OutletSurveyQuestionsPage;
