import { baseQueryWithReauth } from "./base-query";
import { FileUploadResult } from "../models/files/file-upload-result";
import { createApi } from "@reduxjs/toolkit/query/react";

export const filesApi = createApi({
  reducerPath: "filesApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    uploadFile: builder.mutation<FileUploadResult[], FormData>({
      query: (formData) => {
        return {
          url: "/api/files/upload",
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const { useUploadFileMutation } = filesApi;
