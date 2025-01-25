import { AxiosError } from "axios";

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (error.response) {
      return (error.response.data as { error?: string })?.error || 'Unexpected server error occurred.';
    } else if (error.request) {
      return 'No response from server, please check your connection.';
    }
  }
  return 'Failed to send request. Please try again.';
};