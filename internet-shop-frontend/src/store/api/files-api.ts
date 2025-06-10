import { baseQueryWithReauth } from "./base-query";
import { FileUploadResult } from "../models/files/file-upload-result";
import { createApi } from "@reduxjs/toolkit/query/react";

export const filesApi = createApi({
  reducerPath: "filesApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    uploadFile: builder.mutation<FileUploadResult[], string[]>({
      query: (images) => {
        var bodyFormData = new FormData();

        images.forEach((image) => {
          bodyFormData.append("files", image);
        });

        return {
          url: "/api/auth/register",
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data;",
          },
          body: bodyFormData,
          formData: true,
        };
      },
    }),
  }),
});

export const { useUploadFileMutation } = filesApi;
