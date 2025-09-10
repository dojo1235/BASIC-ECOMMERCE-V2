export const validateName = (name) => {
  if (!name) return { valid: false, message: 'Please enter a name.' };
  if (name.length < 3) return { valid: false, message: 'Name must be at least 3 characters long.' };
  if (name.length > 15) return { valid: false, message: 'Name cannot exceed 15 characters.' };
  if (!/^[a-zA-Z0-9]+$/.test(name)) return { valid: false, message: 'Name can only contain letters and numbers.' };
  return { valid: true };
};

export const validateEmail = (email) => {
  if (!email) return { valid: false, message: 'Please enter an email address.' };
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return { valid: false, message: 'Invalid email format.' };
  return { valid: true };
};

export const validatePassword = (password) => {
  if (!password) return { valid: false, message: 'Please enter a password.' };
  if (password.length < 6) return { valid: false, message: 'Password must be at least 6 characters long.' };
  if (!/[a-z]/.test(password)) return { valid: false, message: 'Password must contain at least one lowercase letter.' };
  if (!/[A-Z]/.test(password)) return { valid: false, message: 'Password must contain at least one uppercase letter.' };
  if (!/[0-9]/.test(password)) return { valid: false, message: 'Password must contain at least one number.' };
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return { valid: false, message: 'Password must contain at least one special character.' };
  return { valid: true };
};

export const validateBody = (value, errMessage) => {
  if (!/^\d+$/.test(String(value))) {
    return { valid: false, message: errMessage };
  }

  return { valid: true };
};

export const validateParams = (params, Errmessage) => {
  if (typeof params !== "string" || !/^\d+$/.test(params)) {
    return { valid: false, message: Errmessage };
  }

  return { valid: true };
};