import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const zenithApi = createApi({
  reducerPath: "zenithApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://zenith.fifo-tech.com/api",
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    timeout: 30000,
    setTimeout: (timeout) => {
      return timeout;
    },
  }),
  endpoints: (builder) => ({
    signinUser: builder.mutation({
      query: (body) => {
        return {
          url: "/manageTmsLogin",
          method: "POST",
          body,
          validateStatus: (response, result) =>
            response.status === 200 && !result.isError, // Our tricky API always returns a 200, but sets an `isError` property when there is an error.
        };
      },
    }),
    getCallingDashboard: builder.query({
      query: (body) => {
        const { startDate, endDate, selectedOutlet, region, area, territory } =
          body;
        return {
          url: `/getCallingDashboard?region=${region}&area=${area}&territory=${territory}&startDate=${startDate}&endDate=${endDate}&outletCode=${selectedOutlet}`,
          method: "GET",

          validateStatus: (response, result) =>
            response.status === 200 && !result.isError, // Our tricky API always returns a 200, but sets an `isError` property when there is an error.
        };
      },
    }),
    getAdvocacyDashboard: builder.query({
      query: (body) => {
        const { startDate, endDate, selectedOutlet, region, area, territory } =
          body;
        return {
          url: `/getAdvocacyDashboard?region=${region}&area=${area}&territory=${territory}&startDate=${startDate}&endDate=${endDate}&outletCode=${selectedOutlet}`,
          method: "GET",
          validateStatus: (response, result) =>
            response.status === 200 && !result.isError, // Our tricky API always returns a 200, but sets an `isError` property when there is an error.
        };
      },
    }),
  }),
});

export const {
  useSigninUserMutation,
  useGetAdvocacyDashboardQuery,
  useGetCallingDashboardQuery,
} = zenithApi;
