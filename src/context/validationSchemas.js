import * as yup from 'yup';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d{1,})(?!.*(\d)\1{1,})(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
const nameRegex = /^[a-zA-Z]{3,16}$/;

export const signUpValidationSchema = yup.object().shape({
  email: yup
    .string()
    .matches(emailRegex, 'Email must be well-formed')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must be at most 16 characters')
    .matches(passwordRegex, 'Password must include at least one uppercase letter, one lowercase letter, one special character, and at least two non-consecutive numbers')
    .required('Password is required'),
  name: yup
    .string()
    .matches(nameRegex, 'Name must contain only letters and be 3 to 16 characters long')
    .required('Name is required'),
  lastName: yup
    .string()
    .matches(nameRegex, 'Last name must contain only letters and be 3 to 16 characters long')
    .required('Last name is required'),
  nick: yup
    .string()
    .matches(nameRegex, 'Nickname must contain only letters and be 3 to 16 characters long')
    .required('Nickname is required'),
});

export const signInValidationSchema = yup.object().shape({
  email: yup
    .string()
    .matches(emailRegex, 'Email must be well-formed')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must be at most 16 characters')
    .matches(passwordRegex, 'Password must include at least one uppercase letter, one lowercase letter, one special character, and at least two non-consecutive numbers')
    .required('Password is required'),
});
