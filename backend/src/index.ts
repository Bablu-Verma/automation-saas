import dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import connectDB from './config/db';
import authRoute from './router/authRoute';
import userRoute from './router/userRoute';
import masterWorkflowRoute from './router/masterWorkflowRoute';
import automationRoute from './router/automation';
import cors from 'cors';


connectDB();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));


app.use(express.json());


// Main "Hello World" route
app.get('/', (req, res) => {
    res.send('Hello server');
});

// Auth Routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/workflow-instance', automationRoute);
app.use('/api/v1/master-workflow', masterWorkflowRoute);




// Routes yahan aayenge
// app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});