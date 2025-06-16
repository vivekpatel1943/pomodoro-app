import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { promise } from 'zod';

const app = express();

// configuring our environment variables
dotenv.config();

// middlewares
app.use(express.json());
app.use(cookieParser());

const userMiddleware = async (req,res,next) => {
    console.log("req.cookies",req.cookies)

    const token = req.cookies.token;

    console.log("token access from middleware",token);

    if(!token){
        return res.status(400).json({msg:"token not available"});
    }

    try{
        const verifyToken = (token,secret) => {
            return new Promise((resolve,reject) => {
                jwt.verify(token,secret,(err,data) => {
                    if(err) reject(err);
                    resolve(data);
                })
            })
        }

        const isVerified = await verifyToken(token,process.env.jwt_secret);

        if(!isVerified){
            return res.status(400).json({msg:"invalid token"})
        }

        req.user = isVerified;

        console.log("req.user",req.user);

        next();
    }catch(err){
        console.error(err);
    }
} 

export default userMiddleware;

