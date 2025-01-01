import axios from 'axios';
import { Thread, PostData } from '@/types/thread';

// Function to fetch threads from the database
export async function fetchThreads(pageNumber: number, limit: number = 10)
  : Promise<Thread[]> 
{
  try {
    const response = await axios.get(`http://localhost:8080/threads`, {
      params: {
        page: pageNumber,
        limit: limit
      }
    });
    
    // Return the slice of threads
    return response.data;
  } catch (error) {
    console.error('Error fetching threads:', error);
    return []
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


