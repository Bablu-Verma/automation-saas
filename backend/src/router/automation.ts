import express from 'express'
import { loginCheck } from '../middlewares/loginCheck';
import { createAutomationInstance } from '../controllers/frontend/dashboard/automation/createAutomationInstance';


const automationRoute = express.Router();



automationRoute.post('/create',loginCheck, createAutomationInstance);



export default automationRoute;