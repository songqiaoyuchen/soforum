import { User } from '@/types/user';
import { getErrorMessage } from '@utils/handleError';
import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function userLogin(formData: { username: string; password: string })
  : Promise<{success: boolean, message: string}> 
{
  try {
    const response = await axios.post(`${API_URL}/login`, formData);
    if (response.status === 200) {
      sessionStorage.setItem('jwt', response.data.token);
      return { success: true, message: "Login Successful!"};
    } else {
      console.error('Login failed:', response.data.message);
      return { success: false, message: response.data.message };
    }
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      console.error('Login failed:', err.response?.data?.error);
      return { success: false, message: err.response?.data?.error };
    } else {
      console.error('Unexpected error:', err);
      return { success: false, message: 'Sorry, an unexpected error occurred' };
    }
  }
}

export async function userSignup(formData: { username: string; password: string })
  : Promise<{success: boolean, message: string}> 
{
  try {
    const response = await axios.post(`${API_URL}/signup`, formData);
    if (response.status === 201) {
      return { success: true, message: "Signup Successful!"};
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 400) {
      return { success: false, message: `Signup failed: ${err.response.data.error || 'Invalid input or missing fields'}`};
    } else {
      return { success: false, message: 'Sorry, an unexpected error occurred' };
    }
  }
}

export async function fetchUserProfile(username: string): Promise<User | null> {
  try {
    const response = await axios.get(`${API_URL}/user/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export async function updateUserProfile(username: string, updates: { bio?: string; username?: string }) 
  : Promise<{success: boolean, message: string}> 
{  
  const token = sessionStorage.getItem('jwt');
  const output = {
    success: true,
    message: "User updated successfully"
  };
  try {
    const response = await axios.put(`${API_URL}/user/${username}`, 
      updates,
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
        console.error("Error updating user: ", response.data.error)
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
};