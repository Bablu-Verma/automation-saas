const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL


export const upload_image_admin_api = api_url + 'v1/admin/upload'

// auth 
export const register_api = api_url + 'v1/auth/register'
export const login_api = api_url + 'v1/auth/login'
export const google_login_api = api_url + 'v1/auth/google-login'
export const user_verify_api = api_url + 'v1/auth/verify-user'
export const resend_otp_api = api_url + 'v1/auth/resend-otp'
export const forgot_password_api = api_url + 'v1/auth/forgot-password'
export const change_password_api = api_url + 'v1/auth/change-password'

export const home_service_api = api_url + 'v1/home/service'
export const search_api = api_url + 'v1/home/search'

export const service_list_api = api_url + 'v1/service/list'
export const service_detail_api = api_url + 'v1/service/details'


export const contact_create_api = api_url + 'v1/contact/create'


export const admin_contact_list_api = api_url + 'v1/admin/contact/get'
export const admin_contact_update_api = api_url + 'v1/admin/contact/status'
export const admin_contact_delete_api = api_url + 'v1/admin/contact/delete'


export const newsletter_create_api = api_url + 'v1/newsletter/subscribe'
export const admin_newsletter_list_api = api_url + 'v1/admin/newsletter/list'
export const admin_newsletter_delete_api = api_url + 'v1/admin/newsletter/delete'


export const instance_create_api = api_url + 'v1/instance/automation-create'
export const instance_list_api = api_url + 'v1/instance/automation-list'
export const instance_details_api = api_url + 'v1/instance/automation-details'
export const instance_update_status_api = api_url + 'v1/instance/automation-update-status'






export const payment_details_request_api = api_url + 'v1/payment/payment-details-request'
export const payment_create_request_api = api_url + 'v1/payment/create-payment'
export const payment_get_api = api_url + 'v1/payment/get-payment'

// export const create_instance_value_api = api_url + 'v1/instance/create-credential'


export const user_profile_api = api_url + 'v1/user/get-profile'
export const user_profile_update_api = api_url + 'v1/user/update-profile'



export const admin_user_list_api = api_url + 'v1/admin/user/list'
export const admin_user_details_api = api_url + 'v1/admin/user/details'
export const admin_user_update_api = api_url + 'v1/admin/user/update'


export const admin_automation_list_api = api_url + 'v1/admin/automation/list'



export const admin_create_master_workflow_api = api_url + 'v1/admin/master-workflow/create'
export const admin_list_master_workflow_api = api_url + 'v1/admin/master-workflow/list'
export const admin_details_master_workflow_api = api_url + 'v1/admin/master-workflow/details'
export const admin_edit_master_workflow_api = api_url + 'v1/admin/master-workflow/edit'