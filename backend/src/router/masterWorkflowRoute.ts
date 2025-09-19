import express from 'express'
import { loginCheck } from '../middlewares/loginCheck';
import { addMasterWorkflow } from '../controllers/admin/master-workflow/addMasterWorkflow';
import { listMasterWorkflows } from '../controllers/admin/master-workflow/listMasterWorkflows';
import { editMasterWorkflow } from '../controllers/admin/master-workflow/editMasterWorkflow';
import { deleteMasterWorkflow } from '../controllers/admin/master-workflow/deleteMasterWorkflow';
import { getMasterWorkflowDetail } from '../controllers/admin/master-workflow/getMasterWorkflowDetail';

const masterWorkflowRoute = express.Router();


// admin 
masterWorkflowRoute.post('/create',loginCheck, addMasterWorkflow);
masterWorkflowRoute.post('/list',loginCheck, listMasterWorkflows);
masterWorkflowRoute.post('/edit',loginCheck, editMasterWorkflow);
masterWorkflowRoute.post('/delete',loginCheck, deleteMasterWorkflow);
masterWorkflowRoute.post('/details',loginCheck, getMasterWorkflowDetail);


export default masterWorkflowRoute;