export function validPassword(password: string): boolean {
  // Password must: 
  // 1. be at least 8 characters long
  // 2. contain at least one letter and one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[0-9]).{8,}$/;
  return passwordRegex.test(password)
};

export function validEmail(email: string): boolean {
  // Email must:
  // 1. contain an @ symbol
  // 2. contain a period
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email)
}

export function validUsername(username: string): boolean {
  // Username must:
  // 1. be at least 1 character long
  // 2. contain only letters, numbers, and underscores
  const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
  return usernameRegex.test(username);
}

export function validPost(title: string, content: string, category: string)  {
  // Title must:
  // 1. be at least 1 character long
  // 2. be less than 100 characters
  // Content must:
  // 1. be at least 1 character long
  // 2. be less than 1000 characters
  // Category must not be empty
  let formErrors = { title: '', content: '', category: '' };
  let isValid = true;

  if (title.trim() === '') {
    formErrors.title = 'Title is required';
    isValid = false;
  } else if (title.length > 100) {
    formErrors.title = 'Title must be less than 100 characters';
  }

  if (content.trim() === '') {
    formErrors.content = 'Content is required';
    isValid = false;
  } else if (content.length > 1000) {
    formErrors.content = 'Content must be less than 1000 characters';
    isValid = false;
  }

  if (!category) {
    formErrors.category = 'Category is required';
    isValid = false;
  }

  return {"isValid": isValid, "errors": formErrors};
}

export function validToken(token: string | null): boolean {
  // Check if token exists
  if (!token) {
    console.error("Token required")
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp;
    
    // Check if token is expired
    if (expiry * 1000 < Date.now()) {
      console.error("Token expired")
      return false;
    }

    return true;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
}