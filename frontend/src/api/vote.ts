import axios from "axios";
import { VoteData } from "@/types/thread";
import { getErrorMessage } from "@utils/handleError";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
      `${API_URL}/threads/${threadID}/votes`,
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
  } catch (error) {
    const message = getErrorMessage(error);
    console.error(message);
    output.success = false;
    output.message = message;
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
      `${API_URL}/threads/${threadID}/votes`,
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
  } catch (error) {
    const message = getErrorMessage(error);
    console.error(message);
    output.success = false;
    output.message = message;
  }

  return output;
}

export async function checkVoteState(username: string, threadID: number)
  : Promise<number> 
{
  let output = 0;
  try {
    const response = await axios.get(
      `${API_URL}/${username}/${threadID}/vote_state`,
    );

    if (response.status === 200) {
      output = response.data.vote;
    }
  } catch (error) {
    console.error("Error checking vote state: ", error);
  }
  return output;
}