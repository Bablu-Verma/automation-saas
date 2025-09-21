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
import { getServiceDetail } from '../controllers/frontend/public/service/serviceDetails';
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
import { subscribeNewsletter, unsubscribeNewsletter } from '../controllers/frontend/public/newsletterController';
import { getAllSubscribers } from '../controllers/admin/NewsletterAdminController';


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


// Service
route.post(base + '/service/list', listService);
route.post(base + '/service/details', getServiceDetail);


// master workflow 
route.post(base + '/admin/master-workflow/create',loginCheck, addMasterWorkflow);
route.post(base + '/admin/master-workflow/list',loginCheck, listMasterWorkflows);
route.post(base + '/admin/master-workflow/edit',loginCheck, editMasterWorkflow);
route.post(base + '/admin/master-workflow/delete',loginCheck, deleteMasterWorkflow);
route.post(base + '/admin/master-workflow/details',loginCheck, getMasterWorkflowDetail);


// home 
route.post(base + '/home/service', listHomeService);
route.post(base + '/home/search', searchService);


// automation
route.post(base + '/instance/automation-create',loginCheck, createAutomationInstance);

// contactus 
route.post( base + "/contact/create", createContact);             
route.post( base + "/admin/contact/get", getContacts);    
route.post(base +  "/admin/contact/status", updateContactStatus); 
route.post(base + "/admin/contact/delete", deleteContactus); 


// newsletter 
route.post(base +"/newsletter/subscribe", subscribeNewsletter);     
route.post(base +"/newsletter/unsubscribe", unsubscribeNewsletter); 
route.post(base +"/admin/newsletter/list", getAllSubscribers);   












export default route;