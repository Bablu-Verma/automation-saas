import dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import connectDB from './config/db';
import cors from 'cors';
import route from './router/route';

connectDB();

const app = express();

app.use("/images", express.static("images"));



app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));


app.use(express.json());



app.get('/', (req, res) => {
    res.send('Hello server');
});

// Routes
app.use('/api', route)



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});