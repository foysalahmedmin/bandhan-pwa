import URLS from "@/constants/urls";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunks
export const fetchSurveyData = createAsyncThunk(
  "survey/fetchSurveyData",
  async ({ phaseId, outletId, user, phase }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${URLS.baseURL}/api/outlet-survey/get-surveys`,
        {
          params: { phaseId, outletId },
          headers: { Authorization: user },
        },
      );

      const surveys = data?.data || [];

      const getValueFromSurvey = (survey) => {
        if ("value_string" in survey) return survey.value_string;
        if ("value_number" in survey) return survey.value_number;
        if ("value_date" in survey)
          return new Date(survey.value_date).toISOString();
        if ("value_array" in survey) return survey.value_array;
        if ("value_number_range" in survey) return survey.value_number_range;
        if ("value_date_range" in survey) return survey.value_date_range;
        if ("value_boolean" in survey) return survey.value_boolean;
        return "";
      };

      const groupMap = {};

      // First, collect group questions and group answers
      surveys.forEach((s) => {
        if (s.isGroupDependent) {
          const groupId = `${s.group_base_question}_${s.group_index}`;
          if (!groupMap[groupId]) {
            groupMap[groupId] = {
              group_base_question: s.group_base_question,
              group_base_value: s.group_base_value,
              group_key: s.group_key,
              group_index: s.group_index,
              group_questions: [],
            };
          }
          groupMap[groupId].group_questions.push({
            ...s.question,
            value: getValueFromSurvey(s),
          });
        }
      });

      const groupedById = Object.values(groupMap).reduce((acc, group) => {
        const key = group.group_base_question;
        if (!acc[key]) acc[key] = [];
        acc[key].push(group);
        return acc;
      }, {});

      const mergedQuestions =
        phase?.questions?.map((q) => {
          const found = surveys.find(
            (s) => s.question._id === q._id && !s.isGroupDependent,
          );
          const groupEntries = groupedById[q._id];

          return {
            ...q,
            value: found ? getValueFromSurvey(found) : "",
            ...(groupEntries && groupEntries.length > 0
              ? { groups: groupEntries }
              : {}),
          };
        }) || [];

      return mergedQuestions;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch survey data",
      );
    }
  },
);

export const submitSurvey = createAsyncThunk(
  "survey/submitSurvey",
  async (
    { questions, userInfo, outletId, outletCode, phaseId, user },
    { rejectWithValue },
  ) => {
    try {
      const finalPayload = [];

      const getItem = (q, fields = {}) => {
        return {
          user: userInfo._id,
          outlet: outletId,
          outlet_code: outletCode,
          phase: phaseId,
          question: q._id,
          input_type: q.input_type,
          ...(q.input_type === "number" && {
            value_number: Number(q.value),
          }),
          ...(q.input_type === "date" && {
            value_date: new Date(q.value),
          }),
          ...(["text", "textarea", "email", "tel", "radio", "select"].includes(
            q.input_type,
          ) && {
            value_string: q.value,
          }),
          ...(["checkbox", "select-multiple"].includes(q.input_type) && {
            value_array: q.value,
          }),
          ...(q.input_type === "number-range" && {
            value_number_range: q.value.map((v) => Number(v)),
          }),
          ...(q.input_type === "date-range" && {
            value_date_range: q.value.map((v) => new Date(v)),
          }),
          ...(q.input_type === "boolean" && {
            value_boolean: q.value,
          }),
          ...(fields && fields),
        };
      };

      questions.forEach((q) => {
        if (q.value !== undefined && q.value !== null) {
          if (q.groups?.length > 0) {
            q.groups.forEach((g) => {
              const {
                group_base_question,
                group_base_value,
                group_key,
                group_index,
                group_base_questions,
              } = g;

              if (group_base_questions?.length > 0) {
                group_base_questions.forEach((gq) => {
                  if (gq.value !== undefined && gq.value !== null) {
                    finalPayload.push(
                      getItem(gq, {
                        isGroupDependent: true,
                        group_base_question,
                        group_base_value,
                        group_key,
                        group_index,
                      }),
                    );
                  }
                });
              }
            });
          }

          finalPayload.push(getItem(q));
        }
      });

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

      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to submit survey");
    }
  },
);

export const surveySlice = createSlice({
  name: "survey",
  initialState: {
    initialQuestions: [],
    questions: [],
    isLoading: false,
    isSubmitting: false,
    isSuccessModalOpen: false,
    error: null,
  },
  reducers: {
    setQuestionGroups: (state, action) => {
      const { index, groups } = action.payload;
      if (state.questions[index]) {
        state.questions[index].groups = groups;
      }
    },
    updateQuestionValue: (state, action) => {
      const { index, value } = action.payload;
      if (state.questions[index]) {
        state.questions[index].value = value;
      }
    },
    updateGroupQuestionValue: (state, action) => {
      const { indexes, value } = action.payload;
      if (
        state.questions?.[indexes[0]]?.groups?.[indexes[1]]
          ?.group_base_questions?.[indexes[2]]
      ) {
        state.questions[indexes[0]].groups[indexes[1]].group_base_questions[
          indexes[2]
        ].value = value;
      }
    },
    setSuccessModalOpen: (state, action) => {
      state.isSuccessModalOpen = action.payload;
    },
    resetSurvey: (state) => {
      state.questions = [];
      state.initialQuestions = [];
      state.error = null;
      state.isSuccessModalOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch survey data
      .addCase(fetchSurveyData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSurveyData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.questions = action.payload;
        state.initialQuestions = action.payload;
      })
      .addCase(fetchSurveyData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Submit survey
      .addCase(submitSurvey.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(submitSurvey.fulfilled, (state) => {
        state.isSubmitting = false;
        state.isSuccessModalOpen = true;
      })
      .addCase(submitSurvey.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      });
  },
});

export const {
  setQuestionGroups,
  updateQuestionValue,
  updateGroupQuestionValue,
  setSuccessModalOpen,
  resetSurvey,
} = surveySlice.actions;

export default surveySlice.reducer;
