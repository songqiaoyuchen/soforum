import axios from 'axios';
import { Thread, PostData } from '@/types/thread';
import { getErrorMessage } from '@utils/handleError';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Function to fetch threads from the database
export async function fetchThreads(
  pageNumber: number, 
  limit: number = 10, 
  category?: string, 
  search?: string,
  username?: string,
  sort?: string
)
  : Promise<Thread[]> 
{
  try {
    const response = await axios.get(`${API_URL}/threads`, {
      params: {
        page: pageNumber,
        limit: limit,
        category: category,
        search: search,
        username: username,
        sort: sort
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
    const response = await axios.get(`${API_URL}/threads/${threadID}`);
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
      `${API_URL}/threads/post`, 
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
  } catch (error) {
    const message = getErrorMessage(error);
    console.error(message);
    output.success = false;
    output.message = message;
  }

  return output
}

export async function deleteThread(threadID: number)
  : Promise<{success: boolean, message: string}>
{
  const token = sessionStorage.getItem('jwt');
  const output = {
    success: true,
    message: "Thread deleted successfully"
  };

  try {
    const response = await axios.delete(
      `${API_URL}/threads/${threadID}`, 
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
      console.error("Error deleting thread: ", response.data.error)
      output.success = false;
      output.message = response.data.error;
    }
  } catch (error) {
    const message = getErrorMessage(error);
    console.error(message);
    output.success = false;
    output.message = message;
  }

  return output
}

export async function editThread(threadID: number, postData: PostData)
: Promise<{success: boolean, message: string}> 
{
  const token = sessionStorage.getItem('jwt');
  const output = {
    success: true,
    message: "Thread edited successfully"
  };

  try {
    const response = await axios.put(
      `${API_URL}/threads/${threadID}`, 
      postData,
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
      console.error("Error editing thread: ", response.data.error)
      output.success = false;
      output.message = response.data.error;
    }
  } catch (error) {
    const message = getErrorMessage(error);
    console.error(message);
    output.success = false;
    output.message = message;
  }

  return output
}

export async function saveThread(username: string, threadID: number) 
: Promise<{success: boolean, message: string}>
{
  const token = sessionStorage.getItem('jwt');
  const output = {
    success: true,
    message: "Thread saved successfully"
  };
  try {
    const response = await axios.post(`${API_URL}/user/${username}/save_thread/${threadID}`, 
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
    });
    if (response.status === 200) {
      return output;
    } else {
      console.error("Error saving thread: ", response.data.error)
      output.success = false;
      output.message = response.data.error;
    }
  } catch (error) {
    const message = getErrorMessage(error);
    console.error(message);
    output.success = false;
    output.message = message;
  }

  return output
};

export async function fetchSavedThreads(  
  pageNumber: number, 
  limit: number = 10, 
  username?: string,
)
: Promise<Thread[]> 
{
  const token = sessionStorage.getItem('jwt');
  try {
    const response = await axios.get(`${API_URL}/user/${username}/saved_threads`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params: {
        page: pageNumber,
        limit: limit,
      }
    });
    if (response.status === 200) {
      return Array.isArray(response.data.threads) ? response.data.threads : [];
    } else {
      console.error("Error fetching saved threads: ", response.data.error)
      return [];
    }
  } catch (error) {
    console.error('Error fetching threads:', error);
    return []
  }
};

export async function deleteSavedThread(username: string, threadID: number) {
  const token = sessionStorage.getItem('jwt');
  const output = {
    success: true,
    message: "Thread unsaved successfully"
  };
  try {
    const response = await axios.delete(`${API_URL}/user/${username}/unsave_thread/${threadID}`, 
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      return output;
    } else {
      console.error("Error unsaving thread: ", response.data.error)
      output.success = false;
      output.message = response.data.error;
    }
  } catch (error) {
    const message = getErrorMessage(error);
    console.error(message);
    output.success = false;
    output.message = message;
  }

  return output
}

export async function CheckSaveState(username: string, threadID: number) {
  const token = sessionStorage.getItem('jwt');
  try {
    const response = await axios.get(`${API_URL}/user/${username}/saved_state/${threadID}`, 
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      return response.data.saved;
    } else {
      console.error("Error checking save state: ", response.data.error)
      return false;
    }
  } catch (error) {
    console.error('Error checking save state:', error);
    return false;
  }
}