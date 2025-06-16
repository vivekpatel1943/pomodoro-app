import express from 'express';
import prisma from '../utils/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import cookieParser from 'cookie-parser';
import userMiddleware from '../middlewares/user.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { userSignupInput, userSigninInput, timeInput } from '../types.js';

// configuring our environment variables
dotenv.config(); 

const app = express();
const router = express.Router();

router.use(cookieParser());
router.use(cors({
    origin : "http://localhost:5173",
    credentials:true // this allows cookies to be sent 
}));

app.use(express.json());

router.post('/signup', async (req, res) => {
    try {
        console.log("prisma", prisma)
        console.log("req.body", req.body)
        const parsedPayload = userSignupInput.safeParse(req.body);
        console.log("parsed-payload", parsedPayload);
        if (!parsedPayload.success) {
            return res.status(400).json({ msg: "invalid input..." })
        }

        const { name, email, password } = parsedPayload.data;

        // here 10 is the value for salt rounds
        // salt rounds refer to the recursive hashing that the password shall go through
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword
            }
        })

        res.status(200).json({ msg: "user has been successfully created", user });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "internal server error.." })
    }
})

router.post('/signin', async (req, res) => {
    try {
        const parsedPayload = userSigninInput.safeParse(req.body);

        if (!parsedPayload.success) {
            return res.status(400).json({ msg: "invalid input.." })
        }

        const { email, password } = parsedPayload.data;

        const user = await prisma.user.findUnique({
            where: { email: email }
        })

        if (!user) {
            return res.status(404).json({ msg: "user not available.." })
        }

        console.log("user", user);

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: "invalid password.." })
        }

        // now we are gonna sign this data with jwt
        const signToken = (payload, secret, options) => {
            return new Promise((resolve, reject) => {
                jwt.sign(payload, secret, (err, token) => {
                    if (err) reject(err);
                    resolve(token);
                })
            })
        }

        const token = await signToken({ userId: user.id }, process.env.jwt_secret, { expiresIn: '1w' })

        console.log("token", token);

        // here "token" is the name with which token shall be saved in the cookies object,
        //so with req.cookies.token you can access the token

        res
            .cookie('token', token, {
                httpOnly: true,//prevents javascript access to cookies ,helps to avoid XSS (cross-site-scripting),
                secure: process.env.NODE_ENV === "production" ,
                sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
                //CSRF cross site request forgery
                // prevents CSRF attacks 
                // this ensures that when your app is in production there will be no same-site restriction i.e. anyone can send requests to your server
                // when it is not in production sameSite will lax which means that you can send only get requests from other ports but not post requests,
                maxAge: 7 * 24 * 60 * 60 * 1000 //milliseconds in a week
            }).status(200).json({ msg: "logged in successfully", user })
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "internal server error.." });   
    }
})

router.get('/profile',userMiddleware,async (req,res) => {
    try{
        const user = await prisma.user.findUnique({
            where  : {id : req.user.userId}
        })

        console.log("user",user);

        res.status(200).json({msg:"profile retrieved successfully...",user})
        
    }catch(err){
        console.error(err);
        res.status(500).json("internal server error...")
    }
})

router.post('/sessions', userMiddleware, async (req, res) => {
    try {

        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            include : {
                sessions : true
            }
        })

        console.log("user",user)

        const parsedPayload = timeInput.safeParse(req.body);

        if (!parsedPayload.success) {
            return res.status(400).json({ msg: "invalid input.." })
        }
        console.log("parsedPayload", parsedPayload)
        const { timeInMinutes } = parsedPayload.data;

        const time = await prisma.session.create({
            data: {
                timeInMinutes: timeInMinutes,
                user: {
                    connect: { id: user.id }
                }
            }
        })
        res.status(200).json({ msg: "your session has been sucessfully saved..", time })
    } catch (err) {
        console.error(err)
        res.status(500).json({ msg: "internal server error.." })
    }
})

// the routes purpose is simply to get all the sessions that a user has completed...
router.get('/number-of-sessions',userMiddleware,async (req,res) => {
    try{
       

        // console.log("user",user)

       /*  const sessionsCompleted = await prisma.session.count({
            where : {userId : req.user.userId},
        });

        const totalTime = await prisma.session.aggregate({
            where : {userId : req.user.userId},
            _sum : {
                timeInMinutes : true
            }
        }); */

        const sessions = await prisma.session.findMany({
            where : {userId : req.user.userId},
            select : {
                timeInMinutes : true,
                createdAt : true,
            },
            orderBy : {
                createdAt : 'asc'
            }

        })

        res.status(200).json({msg:"total sessions",sessions})

    }catch(err){
        console.error(err);
        res.status(500).json({msg:"internal server error.."})
    }
})
export default router;


