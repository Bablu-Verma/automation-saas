import express from 'express'
import registerUser from '../controllers/frontend/auth/registerUser';
import verifyUser from '../controllers/frontend/auth/verifyUser';
import loginUser from '../controllers/frontend/auth/login';
import resendOtpController from '../controllers/frontend/auth/resendOTP';
import forgotPassword from '../controllers/frontend/auth/forgotPassword';
import changePassword from '../controllers/frontend/auth/changePassword';
import loginWithGoogle from '../controllers/frontend/auth/loginWithGoogle';
import { loginCheck } from '../middlewares/loginCheck';
import getUserProfile from '../controllers/frontend/dashboard/user/userProfile';
import updateUserProfile from '../controllers/frontend/dashboard/user/updateUser';
import AccountDeleteRequest from '../controllers/frontend/dashboard/user/deleteRequest';
import { listHomeService } from '../controllers/frontend/public/Home';

import { addMasterWorkflow } from '../controllers/admin/master-workflow/addMasterWorkflow';
import { listMasterWorkflows } from '../controllers/admin/master-workflow/listMasterWorkflows';
import { editMasterWorkflow } from '../controllers/admin/master-workflow/editMasterWorkflow';
import { deleteMasterWorkflow } from '../controllers/admin/master-workflow/deleteMasterWorkflow';
import { getMasterWorkflowDetail } from '../controllers/admin/master-workflow/getMasterWorkflowDetail';
import { listService } from '../controllers/frontend/public/service/listService';
import { searchService } from '../controllers/frontend/public/Search';
import { createAutomationInstance } from '../controllers/frontend/dashboard/automation/createAutomationInstance';
import { upload_ } from '../config/multer_';
import { uploadImageByAdmin } from '../controllers/image_upload/imageupload';
import { createContact } from '../controllers/frontend/public/ContactUs';
import { deleteContactus, getContacts, updateContactStatus } from '../controllers/admin/ContactUsAdmin';
import { subscribeNewsletter, unsubscribeNewsletter } from '../controllers/frontend/public/NewsletterController';
import { deleteSubscriber, getAllSubscribers } from '../controllers/admin/NewsletterAdminController';
import { automationList } from '../controllers/frontend/dashboard/automation/automationList';
import { automationDetail } from '../controllers/frontend/dashboard/automation/automationDetails';
import { updateAutomationStatus } from '../controllers/frontend/dashboard/automation/automationUpdateStatus';
import { PaymentDetailsRequest } from '../controllers/frontend/dashboard/payment/payment-details-request';
import { createPayment } from '../controllers/frontend/dashboard/payment/payment-request';
import { getUserPayments } from '../controllers/frontend/dashboard/payment/payment-get';
import { getUserListForAdmin } from '../controllers/admin/users/getUserListForAdmin';
import { getUserDetailsForAdmin } from '../controllers/admin/users/getUsersDetailsForAdmin';
import { updateUserByAdmin } from '../controllers/admin/users/updateUserByAdmin';
import { adminUserAutomations } from '../controllers/admin/automation/adminautomationList';
import { AdminautomationDetail } from '../controllers/admin/automation/adminautomationDetails';
import { getPaymentslistforAdmin } from '../controllers/admin/payment/payment-list';
import { getPaymentDetailsForAdmin } from '../controllers/admin/payment/paymentdetails';
import { AutomateupdateAutomationStatuses } from '../controllers/admin/automation/Automate_automationStatusUpdate';
import { updateAutomationStatusById } from '../controllers/admin/automation/automationStatusUpdate';
import { getPaymentDetails } from '../controllers/frontend/dashboard/payment/payment-details';
import { updatePaymentForAdmin } from '../controllers/admin/payment/paymentedit';
import { CredentialSchema } from '../controllers/admin/CredentialSchema';
import { getUserExecutions } from '../controllers/frontend/dashboard/execution';
import { getUserDashboard } from '../controllers/frontend/dashboard/dashboard';
import { getAdminDashboard } from '../controllers/admin/adminDashboard';
import { InvoiceDownload } from '../controllers/frontend/dashboard/payment/invoice-download';
import { getServiceDetail } from '../controllers/frontend/public/service/getServiceDetail';




const route = express.Router();

const base = '/v1'


// image upload by admin 
route.post(base + "/admin/upload", loginCheck, upload_, uploadImageByAdmin);


// auth 
route.post(base + '/auth/register', registerUser);
route.post(base + '/auth/verify-user', verifyUser);
route.post(base + '/auth/login', loginUser);
route.post(base + '/auth/resend-otp', resendOtpController);
route.post(base + '/auth/forgot-password', forgotPassword);
route.post(base + '/auth/change-password', changePassword);
route.post(base + '/auth/google-login', loginWithGoogle);


// user 
route.post(base + '/user/get-profile',loginCheck, getUserProfile);
route.post(base + '/user/update-profile',loginCheck, updateUserProfile);
route.post(base + '/user/delete-request',loginCheck, AccountDeleteRequest);



route.post(base + '/admin/user/list',loginCheck, getUserListForAdmin );
route.post(base + '/admin/user/details',loginCheck, getUserDetailsForAdmin );
route.post(base + '/admin/user/update',loginCheck, updateUserByAdmin );


// Service
route.post(base + '/service/list', listService);
route.post(base + '/service/details', getServiceDetail);


// master workflow 
route.post(base + '/admin/master-workflow/create',loginCheck, addMasterWorkflow);
route.post(base + '/admin/master-workflow/list',loginCheck, listMasterWorkflows);
route.post(base + '/admin/master-workflow/edit',loginCheck, editMasterWorkflow);
route.post(base + '/admin/master-workflow/delete',loginCheck, deleteMasterWorkflow);
route.post(base + '/admin/master-workflow/details',loginCheck, getMasterWorkflowDetail);


route.post(base + '/admin/automation/list',loginCheck, adminUserAutomations);
route.post(base + '/admin/automation/details',loginCheck, AdminautomationDetail);
route.post(base + '/admin/automation/automateupdate', AutomateupdateAutomationStatuses);
route.post(base + '/admin/automation/update',loginCheck, updateAutomationStatusById);


// home 
route.post(base + '/home/service', listHomeService);
route.post(base + '/home/search', searchService);

// automation
route.post(base + '/instance/automation-create',loginCheck, createAutomationInstance);
route.post(base + '/instance/automation-list',loginCheck, automationList);
route.post(base + '/instance/automation-details',loginCheck, automationDetail);
route.post(base + '/instance/automation-update-status',loginCheck, updateAutomationStatus);


route.post(base + '/payment/payment-details-request',loginCheck, PaymentDetailsRequest);
route.post(base + '/payment/create-payment',loginCheck, createPayment);
route.post(base + '/payment/get-payment',loginCheck, getUserPayments);
route.post(base + '/payment/get-payment-details',loginCheck, getPaymentDetails);


route.post(base + '/admin/payment/list-payment',loginCheck, getPaymentslistforAdmin);
route.post(base + '/admin/payment/payment-details',loginCheck, getPaymentDetailsForAdmin);
route.post(base + '/admin/payment/payment-edit',loginCheck, updatePaymentForAdmin);



// contactus 
route.post( base + "/contact/create", createContact);             
route.post( base + "/admin/contact/get",loginCheck, getContacts);    
route.post(base +  "/admin/contact/status",loginCheck, updateContactStatus); 
route.post(base + "/admin/contact/delete",loginCheck, deleteContactus); 


// newsletter 
route.post(base +"/newsletter/subscribe", subscribeNewsletter);     
route.post(base +"/newsletter/unsubscribe", unsubscribeNewsletter); 
route.post(base +"/admin/newsletter/list",loginCheck, getAllSubscribers);   
route.post(base +"/admin/newsletter/delete",loginCheck, deleteSubscriber);   


route.post(base +"/admin/credential/schema",loginCheck, CredentialSchema);   

route.post(base +"/executions/get-user-executions",loginCheck, getUserExecutions);   
route.post(base +"/dashboard/get-user-dashboard",loginCheck, getUserDashboard);  

route.post(base +"/admin/get-admin-dashboard",loginCheck, getAdminDashboard);


route.post(base +"/get-invoice-download",loginCheck, InvoiceDownload);   













export default route;