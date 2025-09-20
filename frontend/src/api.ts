const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL

export const register_api = api_url + 'v1/auth/register'
export const login_api = api_url + 'v1/auth/login'
export const google_login_api = api_url + 'v1/auth/google-login'
export const user_verify_api = api_url + 'v1/auth/verify-user'
export const resend_otp_api = api_url + 'v1/auth/resend-otp'
export const forgot_password_api = api_url + 'v1/auth/forgot-password'
export const change_password_api = api_url + 'v1/auth/change-password'
export const upload_image_api = api_url + 'v1/upload'

export const create_master_workflow_api = api_url + 'v1/master-workflow/create'
export const list_master_workflow_api = api_url + 'v1/master-workflow/list'
export const details_master_workflow_api = api_url + 'v1/master-workflow/details'
export const edit_master_workflow_api = api_url + 'v1/master-workflow/edit'

export const home_service_api = api_url + 'v1/home/service'
export const search_api = api_url + 'v1/home/search'

export const service_list_api = api_url + 'v1/service/list'
export const service_detail_api = api_url + 'v1/service/details'