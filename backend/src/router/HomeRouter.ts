import express from 'express'
import { listService } from '../controllers/frontend/public/Home';
import { SearchService } from '../controllers/frontend/public/search';



const homeRoute = express.Router();



homeRoute.post('/service', listService);
homeRoute.post('/search', SearchService);




export default homeRoute;