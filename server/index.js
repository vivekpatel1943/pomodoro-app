import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/user.js'
import userMiddleware from './middlewares/user.js';
import cors from 'cors';

import cookieParser from 'cookie-parser';

// configuring the environment variables
dotenv.config();
const app = express();

//middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true // this allows cookies to be sent 
}));

app.use(express.json());
app.use('/user', userRouter);
app.use(cookieParser())

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log("your server is running on port", port, ".")
})