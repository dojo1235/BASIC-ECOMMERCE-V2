import { validateName, validateEmail, validatePassword } from "../utils/validation.util.js"

// Validate register input
export const validateRegisterInput = (req) => {
  const expectedKeys = ['name', 'email', 'password'];
  const payloadKeys = Object.keys(req.body);

  for (const key of expectedKeys) {
    if (!payloadKeys.includes(key)) {
      return { valid: false, message: `${key}: is expected in payload yet missing or spelt incorrectly.` };
    }
  }
  
  let { name, email, password } = req.body;
  
  if (typeof name !== 'string') name = '';
  if (typeof email !== 'string') email = '';
  if (typeof password !== 'string') password = '';

  name = name.trim();
  email = email.trim().toLowerCase();
  password = password.trim();

  const nameResult = validateName(name);
  if (!nameResult.valid) return nameResult;

  const emailResult = validateEmail(email);
  if (!emailResult.valid) return emailResult;

  const passwordResult = validatePassword(password);
  if (!passwordResult.valid) return passwordResult;

  return { valid: true };
};

// Validate login input
export const validateLoginInput = (req) => {
  const expectedKeys = ['email', 'password'];
  const payloadKeys = Object.keys(req.body);

  for (const key of expectedKeys) {
    if (!payloadKeys.includes(key)) {
      return { valid: false, message: `${key}: is expected in payload yet missing or spelt incorrectly.` };
    }
  }
  
  let { email, password } = req.body;
  
  if (typeof email !== 'string') email = '';
  if (typeof password !== 'string') password = '';

  email = email.trim().toLowerCase();

  const emailResult = validateEmail(email);
  if (!emailResult.valid) return emailResult;

  const passwordResult = validatePassword(password);
  if (!passwordResult.valid) return passwordResult;

  return { valid: true };
};