import express from 'express'
import { loginCheck } from '../middlewares/loginCheck';

import { addMasterWorkflow } from '../controllers/admin/master-workflow/addMasterWorkflow';
import { listMasterWorkflows } from '../controllers/admin/master-workflow/listMasterWorkflows';
import { editMasterWorkflow } from '../controllers/admin/master-workflow/editMasterWorkflow';
import { deleteMasterWorkflow } from '../controllers/admin/master-workflow/deleteMasterWorkflow';

const masterWorkflowRoute = express.Router();


// admin 
masterWorkflowRoute.post('/create-master-workflow',loginCheck, addMasterWorkflow);
masterWorkflowRoute.post('/list-master-workflow',loginCheck, listMasterWorkflows);
masterWorkflowRoute.post('/edit-master-workflow',loginCheck, editMasterWorkflow);
masterWorkflowRoute.post('/delete-master-workflow',loginCheck, deleteMasterWorkflow);


export default masterWorkflowRoute;