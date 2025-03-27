import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormControl } from "@/components/ui/FormControl";
import { Radio } from "@/components/ui/Radio";
import useLanguageState from "@/hooks/state/useLanguageState";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const questions_data = {
  1: [
    {
      _id: "q1_1",
      isRequired: true,
      isFollowUpRequired: false,
      question: "বিক্রেতার নাম:",
      note: "",
      type: "text",
      options: [],
    },
    {
      _id: "q1_2",
      isRequired: true,
      isFollowUpRequired: false,
      question: "লিঙ্গ:",
      note: "",
      type: "option",
      options: ["পুরুষ", "মহিলা", "অন্যান্য"],
    },
    {
      _id: "q1_3",
      isRequired: true,
      isFollowUpRequired: false,
      question: "জন্মতারিখ:",
      note: "",
      type: "text",
      options: [],
    },
    {
      _id: "q1_4",
      isRequired: true,
      isFollowUpRequired: false,
      question: "ধর্ম:",
      note: "",
      type: "text",
      options: [],
    },
    {
      _id: "q1_5",
      isRequired: false,
      isFollowUpRequired: false,
      question: "শারীরিক প্রতিবন্ধকতা (যদি থাকে):",
      note: "",
      type: "text",
      options: [],
    },
    {
      _id: "q1_6",
      isRequired: true,
      isFollowUpRequired: true,
      question: "আপনি কি একাই দোকান পরিচালনা করেন?",
      note: "শুধুমাত্র 'না' হলে পরবর্তী প্রশ্ন প্রযোজ্য",
      type: "option",
      options: ["হ্যাঁ", "না"],

      questions: [
        {
          _id: "q1_6_1",
          isRequired: true,
          reference: "না",
          question: "আপনার সহায়ক ব্যক্তি কে?",
          note: "",
          type: "text",
          options: [],
        },
        {
          _id: "q1_6_2",
          isRequired: true,
          reference: "না",
          question: "আপনি দৈনিক কত সময় দোকান পরিচালনা করেন?",
          note: "",
          type: "text",
          options: [],
        },
      ],
    },
    {
      _id: "q1_7",
      isRequired: true,
      isFollowUpRequired: false,
      question: "আপনার ব্যবসার ধরন:",
      note: "",
      type: "text",
      options: [],
    },
    {
      _id: "q1_8",
      isRequired: true,
      isFollowUpRequired: true,
      question: "এই দোকান কি আপনার একক মালিকানাধীন নাকি অংশীদারিত্বে রয়েছে?",
      note: "যদি অংশীদার থাকে, অংশীদারের সংখ্যা এবং তাদের সাথে পারিবারিক সম্পর্ক উল্লেখ করুন",
      type: "option",
      options: ["একক মালিকানা", "অংশীদারিত্ব"],

      questions: [
        {
          _id: "q1_8_1",
          isRequired: true,
          reference: "অংশীদারিত্ব",
          question: "অংশীদারের সংখ্যা এবং পারিবারিক সম্পর্ক:",
          note: "",
          type: "text",
          options: [],
        },
      ],
    },
    {
      _id: "q1_9",
      isRequired: true,
      isFollowUpRequired: true,
      question: "এর আগে আপনি কি অন্য কোনো ব্যবসা বা পেশায় নিয়োজিত ছিলেন?",
      note: "যদি হ্যাঁ, তাহলে বিস্তারিত লিখুন",
      type: "option",
      options: ["হ্যাঁ", "না"],
      questions: [
        {
          _id: "q1_9_1",
          isRequired: true,
          reference: "হ্যাঁ",
          question: "এর আগে আপনি কী করতেন?",
          note: "",
          type: "text",
          options: [],
        },
      ],
    },
    {
      _id: "q1_10",
      isRequired: true,
      isFollowUpRequired: true,
      question: "এই ব্যবসা বিক্রয়ের ক্ষেত্রে আপনার ভবিষ্যৎ পরিকল্পনা কী?",
      note: "যদি হ্যাঁ, তাহলে পরিকল্পনাটি উল্লেখ করুন",
      type: "option",
      options: ["হ্যাঁ", "না"],
      questions: [
        {
          _id: "q1_10_1",
          isRequired: true,
          reference: "হ্যাঁ",
          question: "আপনার পরিকল্পনাটি কী?",
          note: "",
          type: "text",
          options: [],
        },
        {
          _id: "q1_10_2",
          isRequired: true,
          reference: "না",
          question: "এই ব্যবসা নিয়ে আপনার ভবিষ্যৎ পরিকল্পনা কী?",
          note: "",
          type: "text",
          options: [],
        },
      ],
    },
  ],
  2: [
    {
      _id: "q2_1",
      isRequired: true,
      isFollowUpRequired: true,
      question: "আপনি কি পরিবারের একমাত্র উপার্জনক্ষম সদস্য?",
      note: "শুধুমাত্র 'না' হলে পরবর্তী প্রশ্ন প্রযোজ্য",
      type: "option",
      options: ["হ্যাঁ", "না"],
      questions: [
        {
          _id: "q2_1_1",
          isRequired: true,
          reference: "না",
          question: "পরিবারের অন্যান্য উপার্জনকারী সদস্য কতজন?",
          note: "",
          type: "number",
          options: [],
        },
      ],
    },
    {
      _id: "q2_2",
      isRequired: true,
      isFollowUpRequired: false,
      question: "বিবাহিত / অবিবাহিত:",
      note: "",
      type: "option",
      options: ["বিবাহিত", "অবিবাহিত"],
    },
    {
      _id: "q2_3",
      isRequired: false,
      isFollowUpRequired: true,
      question: "আপনা সন্তান আছে?",
      note: "শুধুমাত্র 'হ্যাঁ' হলে পরবর্তী প্রশ্ন প্রযোজ্য",
      type: "option",
      options: ["হ্যাঁ", "না"],
      questions: [
        {
          _id: "q2_3_1",
          isRequired: false,
          reference: "হ্যাঁ",
          question: "ছেলে সংখ্যা",
          note: "",
          type: "number",
          options: [],
        },
        {
          _id: "q2_3_2",
          isRequired: false,
          reference: "হ্যাঁ",
          question: "মেয়ে সংখ্যা",
          note: "",
          type: "number",
          options: [],
        },
      ],
    },
  ],
};

const Question = ({ question, index, subindex, handleAddValue }) => {
  const questions =
    question?.questions?.filter((q) => {
      if (!q?.reference) return true;
      return q?.reference === question?.value;
    }) || [];

  return (
    <div key={question._id} className={cn("mb-6 rounded-lg border p-4")}>
      <div className="mb-3">
        <p
          className={cn(
            "mb-1 font-medium text-gray-800",
            question.isRequired && "font-semibold",
          )}
        >
          {index + 1}. {subindex !== undefined && `${subindex + 1}.`}{" "}
          {question?.question}
          {question.isRequired && <span className="ml-1 text-red-500">*</span>}
        </p>
        {question?.note && (
          <small className="italic text-gray-500">{question.note}</small>
        )}
      </div>

      <div className="space-y-2">
        {question?.type === "text" && (
          <FormControl
            type="text"
            name={`question-${question._id}`}
            placeholder="Enter your answer"
            value={question?.value || null}
            onChange={(e) => handleAddValue(e.target.value, index, subindex)}
          />
        )}

        {question?.type === "number" && (
          <FormControl
            type="number"
            name={`question-${question._id}`}
            placeholder="Enter your answer"
            value={question?.value || null}
            onChange={(e) => handleAddValue(e.target.value, index, subindex)}
          />
        )}

        {question?.type === "option" && (
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
                    value={option}
                    checked={question?.value === option}
                    onChange={(e) =>
                      handleAddValue(e.target.value, index, subindex)
                    }
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              );
            })}
          </div>
        )}

        {question?.type === "multiple-option" && (
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
                    value={option}
                    checked={values.includes(option)}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...values, option]
                        : values.filter((v) => v !== option);

                      handleAddValue(newValues, index, subindex);
                    }}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
      {question?.isFollowUpRequired &&
        question?.value &&
        questions?.length > 0 && (
          <div className="mt-4 border-l-4 border-primary/50 pl-4">
            {questions?.map((question, subindex) => (
              <Question
                key={subindex}
                index={index}
                subindex={subindex}
                question={question}
                handleAddValue={handleAddValue}
              />
            ))}
          </div>
        )}
    </div>
  );
};

const OutletSurveyQuestionsPage = () => {
  const routeLocation = useLocation();
  const navigate = useNavigate();

  const { outletCode, outletName, communication, salesPoint, phase } =
    routeLocation?.state || {};
  const {
    _id,
    name,
    start_date,
    end_date,
    total_questions,
    isCompleted,
    isEnable,
  } = phase || {};

  const { isEnglish } = useLanguageState();

  const [questions, setQuestions] = useState([]);
  const [successModal, setSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setQuestions(questions_data?.[_id] || []);
  }, [_id]);

  const handleAddValue = (value, index, subindex) => {
    const newQuestions = [...questions];
    const targetQuestion =
      subindex === undefined
        ? newQuestions[index]
        : newQuestions[index].questions[subindex];

    targetQuestion.value = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      // const url = URLS.baseURL + "/app/outlet-survey";
      // const payload = {
      //   outletCode: outletCode,
      //   salesPoint: salesPoint,
      //   phase: _id,
      // };
      // const response = await axios.post(url, payload);
      // if (response.status === 200) {
      //   setSuccessModal(true);
      // }
      setIsLoading(false);
    } catch (err) {
      console.error("Error submitting data:", err);
      setIsLoading(false);
      alert("Something went wrong");
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
          <>
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
              <Button onClick={handleSubmit} isLoading={isLoading}>
                <span>{isEnglish ? "Submit" : "সাবমিট"}</span>
              </Button>
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
          </>
        </div>
      </section>
    </div>
  );
};

export default OutletSurveyQuestionsPage;
