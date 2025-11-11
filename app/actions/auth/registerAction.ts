'use server';

import bcrypt from 'bcryptjs';
import z from 'zod';
import type { registerState } from '@/app/lib/type/actionType';
import enMessages from './messages.en.json';
import viMessages from './messages.vi.json';

const PASSWORD_MIN_LENGTH = Number(process.env.PASSWORD_MIN_LENGTH ?? '6');

// Message key configuration - loaded from environment or use defaults
const messageKeyConfig = {
  passwordTooShort: process.env.MSG_PASSWORD_TOO_SHORT ?? 'PASSWORD_TOO_SHORT',
  confirmPasswordTooShort:
    process.env.MSG_CONFIRM_PASSWORD_TOO_SHORT ?? 'CONFIRM_PASSWORD_TOO_SHORT',
  passwordsDoNotMatch:
    process.env.MSG_PASSWORDS_DO_NOT_MATCH ?? 'PASSWORDS_DO_NOT_MATCH',
  nameRequired: process.env.MSG_NAME_REQUIRED ?? 'NAME_REQUIRED',
  emailNotValid: process.env.MSG_EMAIL_NOT_VALID ?? 'EMAIL_NOT_VALID',
};

// Localized message configuration
const localizedMessageConfig = {
  viPasswordMismatch: process.env.VI_PASSWORD_MISMATCH ?? 'Mật khẩu không khớp',
  viNameRequired: process.env.VI_NAME_REQUIRED ?? 'Tên là bắt buộc',
};

const formatMessage = (key: string, locale: 'en' | 'vi'): string => {
  const isLocaleVietnam = locale === 'vi';

  switch (key) {
    case messageKeyConfig.passwordTooShort:
      return isLocaleVietnam
        ? `Mật khẩu phải dài ít nhất ${PASSWORD_MIN_LENGTH} ký tự`
        : `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;

    case messageKeyConfig.confirmPasswordTooShort:
      return isLocaleVietnam
        ? `Xác nhận mật khẩu phải dài ít nhất ${PASSWORD_MIN_LENGTH} ký tự`
        : `Confirm password must be at least ${PASSWORD_MIN_LENGTH} characters`;

    case messageKeyConfig.passwordsDoNotMatch:
      return isLocaleVietnam
        ? localizedMessageConfig.viPasswordMismatch
        : 'Passwords do not match';

    case messageKeyConfig.nameRequired:
      return isLocaleVietnam
        ? localizedMessageConfig.viNameRequired
        : 'Name is required';

    case messageKeyConfig.emailNotValid:
      return isLocaleVietnam ? 'Email không hợp lệ' : 'Email is not valid';

    default:
      return key;
  }
};

const createRegisterSchema = (locale: 'en' | 'vi') => {
  const messageConfig = { messages: locale === 'vi' ? viMessages : enMessages };

  return z
    .object({
      name: z
        .string()
        .min(1, formatMessage(messageConfig.messages.nameRequired, locale)),
      email: z
        .string()
        .email(formatMessage(messageConfig.messages.emailNotValid, locale)),
      password: z
        .string()
        .min(
          PASSWORD_MIN_LENGTH,
          formatMessage(messageConfig.messages.passwordTooShort, locale)
        ),
      confirmPassword: z
        .string()
        .min(
          PASSWORD_MIN_LENGTH,
          formatMessage(messageConfig.messages.confirmPasswordTooShort, locale)
        ),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: formatMessage(
        messageConfig.messages.passwordsDoNotMatch,
        locale
      ),
      path: ['confirmPassword'],
    });
};

export async function validateAndRegisterUser(
  prevState: registerState,
  formData: FormData,
  locale: 'en' | 'vi' = 'en'
): Promise<registerState> {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };

  const RegisterSchema = createRegisterSchema(locale);
  const validationResult = RegisterSchema.safeParse(rawData);

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
      message: 'Validation failed',
    };
  }

  try {
    const { name, email, password } = validationResult.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user exists using POST request (avoid sensitive data in URL query params)
    const userCheckRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_MOCK_URL}/users`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }
    );

    if (!userCheckRes.ok && userCheckRes.status !== 404) {
      return {
        message: 'Failed to check user existence',
        errors: {},
      };
    }

    // Email exists
    if (userCheckRes.ok) {
      const errorMessage =
        locale === 'vi' ? 'Email đã tồn tại' : 'Email already exists';
      return {
        message: errorMessage,
        errors: { email: [errorMessage] },
      };
    }

    // Register user
    const registerRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_MOCK_URL}/users`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password: hashedPassword,
          role: 'user',
        }),
      }
    );

    if (!registerRes.ok) {
      return {
        message: 'Failed to register user',
        errors: {},
      };
    }

    return {
      message: '',
      errors: {},
    };
  } catch (err) {
    return {
      message: err instanceof Error ? err.message : String(err),
      errors: {},
    };
  }
}

// Backward compatibility
export const registerAction = validateAndRegisterUser;
