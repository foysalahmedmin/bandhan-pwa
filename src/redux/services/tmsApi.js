import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Utility function to create an API with a dynamic base URL
export const initializeApi = ({ reducerPath, baseUrl }) =>
  createApi({
    reducerPath,
    baseQuery: fetchBaseQuery({
      baseUrl,
      headers: { "Content-Type": "application/json" },
      timeout: 30000,
    }),
    endpoints: (builder) => ({
      signinUser: builder.mutation({
        query: (body) => ({
          url: "/manageTmsLogin",
          method: "POST",
          body,
        }),
      }),
      getCallingDashboard: builder.query({
        query: ({
          startDate,
          endDate,
          selectedOutlet,
          region,
          area,
          territory,
        }) => ({
          url: `/getCallingDashboard?region=${region}&area=${area}&territory=${territory}&startDate=${startDate}&endDate=${endDate}&outletCode=${selectedOutlet}`,
          method: "GET",
        }),
      }),
      getAdvocacyDashboard: builder.query({
        query: ({
          startDate,
          endDate,
          selectedOutlet,
          region,
          area,
          territory,
        }) => ({
          url: `/getAdvocacyDashboard?region=${region}&area=${area}&territory=${territory}&startDate=${startDate}&endDate=${endDate}&outletCode=${selectedOutlet}`,
          method: "GET",
        }),
      }),
    }),
  });

// Zenith API
export const zenithApi = initializeApi({
  reducerPath: "zenithApi",
  baseUrl: "https://zenith.fifo-tech.com/api",
});

// Sheikh API
export const sheikhApi = initializeApi({
  reducerPath: "sheikhApi",
  baseUrl: "https://sheikhlup.fifo-tech.com/api",
});

// Export hooks for both APIs
export const {
  useSigninUserMutation: useZenithSigninUserMutation,
  useGetCallingDashboardQuery: useZenithGetCallingDashboardQuery,
  useGetAdvocacyDashboardQuery: useZenithGetAdvocacyDashboardQuery,
} = zenithApi;

export const {
  useSigninUserMutation: useSheikhSigninUserMutation,
  useGetCallingDashboardQuery: useSheikhGetCallingDashboardQuery,
  useGetAdvocacyDashboardQuery: useSheikhGetAdvocacyDashboardQuery,
} = sheikhApi;
