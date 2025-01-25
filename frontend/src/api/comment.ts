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
  : Promise<{success: boolean, message: string, comment: ThreadComment}>
{
  const token = sessionStorage.getItem('jwt');
  const output = {
    success: true,
    message: "Thread posted successfully",
    comment: {} as ThreadComment
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
      output.comment = response.data.comment;
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

export async function deleteComment(commentID: number)
  : Promise<{success: boolean, message: string}>
{
  const token = sessionStorage.getItem('jwt');
  const output = {
    success: true,
    message: "Comment deleted successfully"
  };

  try {
    const response = await axios.delete(
      `http://localhost:8080/threads/1/comments/${commentID}`, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    ); 

    if (response.status === 200) {
      return output;
    } else {
      console.error("Error deleting comment: ", response.data.error)
      output.success = false;
      output.message = response.data.error;
    }
  } catch (error: any) {
    if (error.response) {
      console.error('Server Error:', error.response.data.error || 'Unexpected error occurred');
      output.success = false;
      output.message =  error.response.data.error || 'Unexpected server error occurred.';
    } else if (error.request) {
      console.error("Error deleting comment: no response from server");
      output.success = false;
      output.message = "No response from server, please check your connection.";
    } else {
      console.error('Error deleting comment: ', error.message);
      output.success = false;
      output.message = "Failed to send request. Please try again.";
    }
  } 

  return output
}

export async function editComment(commentID: number, commentData: CommentData)
: Promise<{success: boolean, message: string}> 
{
  const token = sessionStorage.getItem('jwt');
  const output = {
    success: true,
    message: "Thread edited successfully"
  };

  try {
    const response = await axios.put(
      `http://localhost:8080/threads/1/comments/${commentID}`, 
      commentData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    ); 

    if (response.status === 200) {
      return output;
    } else {
      console.error("Error editing comment: ", response.data.error)
      output.success = false;
      output.message = response.data.error;
    }
  } catch (error: any) {
    if (error.response) {
      console.error('Server Error:', error.response.data.error || 'Unexpected error occurred');
      output.success = false;
      output.message =  error.response.data.error || 'Unexpected server error occurred.';
    } else if (error.request) {
      console.error("Error editing comment: no response from server");
      output.success = false;
      output.message = "No response from server, please check your connection.";
    } else {
      console.error('Error editing comment: ', error.message);
      output.success = false;
      output.message = "Failed to send request. Please try again.";
    }
  } 

  return output
}