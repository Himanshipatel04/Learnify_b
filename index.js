import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import "./src/auth/passport.js"
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.config.js';
import cors from 'cors';


dotenv.config();

const app = express();

//Request Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());


app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));


// Connect to MongoDB   
connectDB();

// Import routes    
import { authRouter } from './src/routes/auth.routes.js';
import { likeRouter } from './src/routes/like.routes.js';
import { commentRouter } from './src/routes/comment.routes.js';    
import { projectRouter } from './src/routes/project.routes.js';
import { geminiRouter } from './src/routes/gemini.routes.js'; 
import ideaRouter from './src/routes/idea.routes.js';
app.use('/auth', authRouter);
app.use('/likes', likeRouter);
app.use('/comments', commentRouter);
app.use('/projects',projectRouter);
app.use('/ideas',ideaRouter)
app.use('/gemini', geminiRouter);               

//Start the server  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




