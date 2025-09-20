import dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import connectDB from './config/db';
import authRoute from './router/authRoute';
import userRoute from './router/userRoute';
import masterWorkflowRoute from './router/masterWorkflowRoute';
import automationRoute from './router/automation';
import cors from 'cors';
import { loginCheck } from './middlewares/loginCheck';
import { upload_ } from './config/multer_';
import { uploadImageByAdmin } from './controllers/image_upload/imageupload';
import homeRoute from './router/HomeRouter';
import serviceRoute from './router/serviceRouter';

connectDB();

const app = express();


app.use("/images", express.static("images"));
const router = express.Router();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));


app.use(express.json());



app.get('/', (req, res) => {
    res.send('Hello server');
});



router.post("/upload", loginCheck, upload_, uploadImageByAdmin);


app.use('/api/v1', router)



// Auth Routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/master-workflow', masterWorkflowRoute);
app.use('/api/v1/automation-instance', automationRoute);
app.use('/api/v1/home', homeRoute);
app.use('/api/v1/service', serviceRoute);





// Routes yahan aayenge
// app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});