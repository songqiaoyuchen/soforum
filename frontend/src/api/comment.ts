import { CommentData, ThreadComment } from "@/types/thread";
import axios from "axios";

export async function fetchComments(threadID: number): Promise<ThreadComment[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds delay to test loading UI
    const response = await axios.get(`http://localhost:8080/threads/${threadID}/comments`);
    
    return response.data ? response.data.comments : [];
  } catch (error) {
    console.error('Error fetching single thread:', error);
    return [];
  }
}

export async function postComment(threadID: number, comment: CommentData)
  : Promise<{success: boolean, message: string}>
{
  const token = sessionStorage.getItem('jwt');
  const output = {
    success: true,
    message: "Thread posted successfully"
  };

  try {
    const response = await axios.post(
      `http://localhost:8080/threads/${threadID}/comments`, 
      comment,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    ); 

    if (response.status === 201) {
      return output;
    } else {
      console.error("Error posting thread: ", response.data.error)
      output.success = false;
      output.message = response.data.error;
    }
  } catch (error: any) {
    if (error.response) {
      console.error('Server Error:', error.response.data.error || 'Unexpected error occurred');
      output.success = false;
      output.message =  error.response.data.error || 'Unexpected server error occurred.';
    } else if (error.request) {
      console.error("Error posting comment: no response from server");
      output.success = false;
      output.message = "No response from server, please check your connection.";
    } else {
      console.error('Error posting comment: ', error.message);
      output.success = false;
      output.message = "Failed to send request. Please try again.";
    }
  } 

  return output
}