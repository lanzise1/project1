import customFetch from "./request";

interface UploadResponse {
    message: string;
    file_path: string;
    file_id:string
}
export const uploadFileApi = (formData: FormData) => {
    return customFetch.post<UploadResponse>(
        "/pyapi/upload",
        formData,
    );
};
