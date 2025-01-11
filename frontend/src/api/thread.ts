import axios from 'axios';
import { Thread, ThreadComment, PostData } from '@/types/thread';

// Function to fetch threads from the database
export async function fetchThreads(
  pageNumber: number, 
  limit: number = 10, 
  category?: string, 
  search?: string,
)
  : Promise<Thread[]> 
{
  try {
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds delay to test loading UI
    const response = await axios.get(`http://localhost:8080/threads`, {
      params: {
        page: pageNumber,
        limit: limit,
        category: category,
        search: search
      }
    });
    
    // Return the slice of threads
    return Array.isArray(response.data?.threads) ? response.data.threads : [];
  } catch (error) {
    console.error('Error fetching threads:', error);
    return []
  }
}

// Function to fetch a single thread from the database
export async function fetchSingleThread(threadID: number): Promise<Thread | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds delay to test loading UI
    const response = await axios.get(`http://localhost:8080/threads/${threadID}`);
    
    return response.data ? response.data.thread : null;
  } catch (error) {
    console.error('Error fetching single thread:', error);
    return null;
  }
}


export async function postThread(postData: PostData)
  : Promise<{success: boolean, message: string}> 
{
  const token = sessionStorage.getItem('jwt');
  const output = {
    success: true,
    message: "Thread posted successfully"
  };

  try {
    const response = await axios.post(
      'http://localhost:8080/threads/post', 
      postData,
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
      console.error("Error posting thread: no response from server");
      output.success = false;
      output.message = "No response from server, please check your connection.";
    } else {
      console.error('Error posting thread: ', error.message);
      output.success = false;
      output.message = "Failed to send request. Please try again.";
    }
  } 

  return output
}

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

export async function deleteThread(threadID: number)
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
      console.error("Error deleting thread: no response from server");
      output.success = false;
      output.message = "No response from server, please check your connection.";
    } else {
      console.error('Error deleting thread: ', error.message);
      output.success = false;
      output.message = "Failed to send request. Please try again.";
    }
  } 

  return output
}