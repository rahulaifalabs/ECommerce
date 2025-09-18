// AUTO-ADDED RTK Query API - add endpoints as you migrate slices
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api', credentials: 'include' }),
  endpoints: (builder) => ({
    login: builder.mutation<any, {email: string; password: string}>({
      query: (credentials) => ({ url: '/auth/login', method: 'POST', body: credentials }),
    }),
    register: builder.mutation<any, {userName: string; email: string; password: string}>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),
    checkAuth: builder.query<any, void>({ query: () => '/auth/check-auth' }),
  }),
});
export const { useLoginMutation, useRegisterMutation, useCheckAuthQuery } = api;
