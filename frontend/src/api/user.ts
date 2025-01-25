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