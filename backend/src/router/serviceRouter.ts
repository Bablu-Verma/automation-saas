import express from 'express'
import { listService } from '../controllers/frontend/public/Home';
import { getServiceDetail } from '../controllers/frontend/public/service/serviceDetails';




const serviceRoute = express.Router();


serviceRoute.post('/list', listService);
serviceRoute.post('/details', getServiceDetail);



export default serviceRoute;