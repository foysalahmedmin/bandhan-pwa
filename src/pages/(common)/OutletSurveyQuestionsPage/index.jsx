import BaseQuestion from "@/components/(survey-page)/BaseQuestion";
import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import useAuthenticationState from "@/hooks/state/useAuthenticationState";
import useLanguageState from "@/hooks/state/useLanguageState";
import {
  fetchSurveyData,
  resetSurvey,
  setSuccessModalOpen,
  submitSurvey,
} from "@/redux/slices/surveySlice";
import { Check } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

// Memoized Success Modal
const SuccessModal = React.memo(
  ({ isEnglish, phase, totalOutlets, navigate, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-8 text-center">
        <div className="mb-4">
          <Check className="mx-auto mb-4 text-green-500" size={40} />
          <h2 className="mb-2 text-xl font-bold">
            {isEnglish
              ? "Submission Successful!"
              : "সফলভাবে জমা দেওয়া হয়েছে!"}
          </h2>
          <p className="mb-2">
            <span className="text-sm">Last Submission Date: </span>
            <span className="text-sm font-bold">
              {new Date(phase?.end_date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </p>
          <div className="mt-2 flex items-center justify-center gap-2 text-sm">
            <span className="font-medium">
              Total: <span className="font-bold">{totalOutlets || 0}</span>
            </span>
            <div className="h-4 w-1 bg-gray-300" />
            <span className="font-medium">
              Completed:{" "}
              <span className="font-bold">
                {(phase?.completed_outlets || 0) + 1}
              </span>
            </span>
            <div className="h-4 w-1 bg-gray-300" />
            <span className="font-medium">
              Remaining:{" "}
              <span className="font-bold">
                {Math.max(
                  0,
                  (totalOutlets || 0) - ((phase?.completed_outlets || 0) + 1),
                )}
              </span>
            </span>
          </div>
        </div>
        <Button
          onClick={() => {
            onClose();
            navigate(-1);
          }}
        >
          {isEnglish ? "Return to Dashboard" : "ড্যাশবোর্ডে ফিরে যান"}
        </Button>
      </div>
    </div>
  ),
);
SuccessModal.displayName = "SuccessModal";

// Memoized Outlet Info Display
const OutletInfo = React.memo(({ outlet }) => {
  const outletFields = [
    { label: "Outlet Name", value: outlet?.name },
    { label: "Outlet Code", value: outlet?.code },
    { label: "Retailer Name", value: outlet?.retailer?.name },
    { label: "Retailer Number", value: outlet?.retailer?.phone },
    { label: "Retailer Address", value: outlet?.retailer?.address },
    { label: "Retailer Category", value: outlet?.category },
  ];

  return (
    <div className="mb-6 space-y-2">
      {outletFields.map((field, idx) => (
        <div key={idx} className="grid grid-cols-4 items-center gap-2">
          <span className="text-sm leading-none">{field.label}</span>
          <FormControl
            as="div"
            className="pointer-events-none col-span-3 h-auto min-h-form-control justify-center text-center text-sm"
          >
            {field.value || "N/A"}
          </FormControl>
        </div>
      ))}
    </div>
  );
});
OutletInfo.displayName = "OutletInfo";

// Main Component
const OptimizedOutletSurveyQuestionsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, userInfo } = useAuthenticationState();
  const { isEnglish } = useLanguageState();

  const {
    questions,
    initialQuestions,
    isLoading,
    isSubmitting,
    isSuccessModalOpen,
    error,
  } = useSelector((state) => state.survey);

  const { totalOutlets, outlet, phase } = state || {};
  const phaseId = phase?._id;
  const outletId = outlet?._id;
  const outletCode = outlet?.code;

  const data = useMemo(() => ({ outlet, state }), [outlet, state]);

  // Fetch survey data on mount
  useEffect(() => {
    if (phaseId && outletId && user && phase) {
      dispatch(
        fetchSurveyData({
          phaseId,
          outletId,
          user,
          questions: phase?.questions || [],
        }),
      );
    }

    // Cleanup on unmount
    return () => {
      dispatch(resetSurvey());
    };
  }, [dispatch, phaseId, outletId, user, phase]);

  // Handle form submission
  const handleSubmit = React.useCallback(
    async (e) => {
      e.preventDefault();
      if (!questions.length) return;

      dispatch(
        submitSurvey({
          questions,
          userInfo,
          outletId,
          outletCode,
          phaseId,
          user,
        }),
      );
    },
    [dispatch, questions, userInfo, outletId, outletCode, phaseId, user],
  );

  // Handle success modal close
  const handleSuccessModalClose = React.useCallback(() => {
    dispatch(setSuccessModalOpen(false));
  }, [dispatch]);

  // Show error alert
  useEffect(() => {
    if (error) {
      alert(isEnglish ? `Error: ${error}` : `ত্রুটি: ${error}`);
    }
  }, [error, isEnglish]);

  // Loading state
  if (!phase || isLoading) {
    return (
      <div className="container flex min-h-64 items-center justify-center py-4">
        <div className="text-center">
          <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>{isEnglish ? "Loading..." : "লোড হচ্ছে..."}</p>
        </div>
      </div>
    );
  }

  return (
    <main>
      <section className="py-4">
        <div className="container">
          <h1 className="mb-6 text-2xl font-bold">{phase?.name}</h1>

          {outlet && <OutletInfo outlet={outlet} isEnglish={isEnglish} />}

          <form onSubmit={handleSubmit}>
            <div className="border border-primary p-2">
              {initialQuestions.map((question, index) => (
                <BaseQuestion
                  key={question._id}
                  question={question}
                  index={index}
                  data={data}
                />
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <Button type="submit" disabled={isSubmitting || isLoading}>
                {isSubmitting
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
              isEnglish={isEnglish}
              phase={phase}
              totalOutlets={totalOutlets}
              navigate={navigate}
              onClose={handleSuccessModalClose}
            />
          )}
        </div>
      </section>
    </main>
  );
};

export default OptimizedOutletSurveyQuestionsPage;
