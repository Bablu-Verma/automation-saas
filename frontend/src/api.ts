const api_url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

export const register_api = api_url + 'v1/auth/register'
export const login_api = api_url + 'v1/auth/login'
export const google_login_api = api_url + 'v1/auth/google-login'
export const user_verify_api = api_url + 'v1/auth/verify-user'
export const resend_otp_api = api_url + 'v1/auth/resend-otp'
export const forgot_password_api = api_url + 'v1/auth/forgot-password'
export const change_password_api = api_url + 'v1/auth/change-password'