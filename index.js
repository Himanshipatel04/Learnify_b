import express from 'express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import "./src/auth/passport.js"
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.config.js';
import cors from 'cors';

dotenv.config();
const app = express();

app.use(generalLimiter);

//Request Logger
app.use((req, _, next) => {
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
import { ideaRouter } from './src/routes/idea.routes.js';
import { userRouter } from './src/routes/user.routes.js';
import { generalLimiter } from './src/middlewares/ratelimiter.middleware.js';
import { blogRouter } from './src/routes/blog.routes.js'
app.use('/auth', authRouter);
app.use('/likes', likeRouter);
app.use('/comments', commentRouter);
app.use('/projects', projectRouter);
app.use('/ideas', ideaRouter)
app.use('/gemini', geminiRouter);
app.use('/users', userRouter);
app.use('/blogs', blogRouter)

//Start the server  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




