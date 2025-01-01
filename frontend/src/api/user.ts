import axios from 'axios';

export async function userLogin(formData: { username: string; password: string })
  : Promise<{success: boolean, message: string}> 
{
  try {
    const response = await axios.post('http://localhost:8080/login', formData);
    if (response.status === 200) {
      console.log(response);
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
