import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = 'http://localhost:8000/'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getPersonas: builder.query({
      query: (params) => ({
        url: 'personas/get',
        params,
      }),
    }),
    createPersona: builder.mutation({
      query: (data) => {
        return {
          url: 'personas/post',
          method: 'POST',
          body: data,
        };
      },
    }),
    updatePersona: builder.mutation({
      query: ({ id, data }) => ({
        url: `personas/update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deletePersona: builder.mutation({
      query: (id) => ({
        url: `personas/delete/${id}`,
        method: 'DELETE',
      }),
    }),
    getMaterias: builder.query({
      query: (params) => ({
        url: 'materias/get',
        params,
      }),
    }),
    createMateria: builder.mutation({
      query: (data) => ({
        url: 'materias/post',
        method: 'POST',
        body: data,
      }),
    }),
    updateMateria: builder.mutation({
      query: ({ id, data }) => ({
        url: `materias/update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteMateria: builder.mutation({
      query: (id) => ({
        url: `materias/delete/${id}`,
        method: 'DELETE',
      }),
    }),
    getCarreras: builder.query({
      query: (params) => ({
        url: 'carreras/get',
        params,
      }),
    }),
    createCarrera: builder.mutation({
      query: (data) => ({
        url: 'carreras/post',
        method: 'POST',
        body: data,
      }),
    }),
    updateCarrera: builder.mutation({
      query: ({ id, data }) => ({
        url: `carreras/update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteCarrera: builder.mutation({
      query: (id) => ({
        url: `carreras/delete/${id}`,
        method: 'DELETE',
      }),
    }),
    getLeads: builder.query({
      query: (params) => ({
        url: 'leads/get',
        params,
      }),
    }),
    createLead: builder.mutation({
      query: (data) => ({
        url: 'leads/post',
        method: 'POST',
        body: data,
      }),
    }),
    deleteLead: builder.mutation({
      query: (id) => ({
        url: `leads/delete/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetPersonasQuery,
  useCreatePersonaMutation,
  useUpdatePersonaMutation,
  useDeletePersonaMutation,
  useGetMateriasQuery,
  useCreateMateriaMutation,
  useUpdateMateriaMutation,
  useDeleteMateriaMutation,
  useGetCarrerasQuery,
  useCreateCarreraMutation,
  useUpdateCarreraMutation,
  useDeleteCarreraMutation,
  useGetLeadsQuery,
  useCreateLeadMutation,
  useDeleteLeadMutation,
} = apiSlice;

export default apiSlice;