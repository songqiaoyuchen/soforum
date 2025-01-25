import axios from "axios";
import { VoteData } from "@/types/thread";

export async function castVote(threadID: number, vote: VoteData)
  : Promise<{ success: boolean, message: string }> 
{
  const token = sessionStorage.getItem('jwt');
  const output = {
    success: true,
    message: "Vote casted successfully"
  };

  try {
    const response = await axios.post(
      `http://localhost:8080/threads/${threadID}/votes`,
      vote,
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
      console.error("Error casting vote: ", response.data.error);
      output.success = false;
      output.message = response.data.error;
    }
  } catch (error: any) {
    if (error.response) {
      console.error('Server Error:', error.response.data.error || 'Unexpected error occurred');
      output.success = false;
      output.message = error.response.data.error || 'Unexpected server error occurred.';
    } else if (error.request) {
      console.error("Error casting vote: no response from server");
      output.success = false;
      output.message = "No response from server, please check your connection.";
    } else {
      console.error('Error casting vote: ', error.message);
      output.success = false;
      output.message = "Failed to send request. Please try again.";
    }
  }

  return output;
}

export async function deleteVote(threadID: number)
  : Promise<{ success: boolean, message: string }> {
  const token = sessionStorage.getItem('jwt');
  const output = {
    success: true,
    message: "Vote deleted successfully"
  };

  try {
    const response = await axios.delete(
      `http://localhost:8080/threads/${threadID}/votes`,
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
      console.error("Error deleting vote: ", response.data.error);
      output.success = false;
      output.message = response.data.error;
    }
  } catch (error: any) {
    if (error.response) {
      console.error('Server Error:', error.response.data.error || 'Unexpected error occurred');
      output.success = false;
      output.message = error.response.data.error || 'Unexpected server error occurred.';
    } else if (error.request) {
      console.error("Error deleting vote: no response from server");
      output.success = false;
      output.message = "No response from server, please check your connection.";
    } else {
      console.error('Error deleting vote: ', error.message);
      output.success = false;
      output.message = "Failed to send request. Please try again.";
    }
  }

  return output;
}

export async function checkVoteState(username: string, threadID: number)
  : Promise<number> 
{
  let output = -0;
  try {
    const response = await axios.get(
      `http://localhost:8080/${username}/${threadID}/vote_state`,
    );

    if (response.status === 200) {
      output = response.data.vote;
    }
  } catch (error) {
    console.error("Error checking vote state: ", error);
  }
  return output;
}