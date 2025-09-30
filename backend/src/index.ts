import dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import connectDB from './config/db';
import cors from 'cors';
import route from './router/route';

connectDB();

export const app_ = express();

app_.use("/images", express.static("images"));



app_.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));


app_.use(express.json());



app_.get('/', (req, res) => {
    res.send('Hello server');
});

// Routes
app_.use('/api', route)

// import './lib/OAuth2';


const PORT = process.env.PORT || 5000;

app_.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});