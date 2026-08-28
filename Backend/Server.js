import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose';
import {Mongo} from './Config/Db.js';
import userhan from './Routes/UserRoute.js'
import Formin from './Routes/FormRoute.js';
import gog from './Routes/googleUesr.js';
import rou from './Routes/PaymentRoute.js';
import rro from './Routes/ProfileRoute.js';
import { roog } from './Routes/AdminRoute.js';
import worksRouter from './Routes/WorksRoute.js';
import businessEnquiryRoutes from './Routes/BusinessEnquiryRoute.js';
import chatRoutes from "./Routes/chatRoutes.js";
const app=express();

//middleware

//middleware
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "https://portfoliobuilder-three.vercel.app",
    "https://portfolio-builder-eight-chi.vercel.app",
    "https://portfolio-builder-git-main-pramodakhidrapur-4643s-projects.vercel.app",
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL
  ].filter(Boolean),
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "token", "Accept"],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
Mongo();


app.use('/api/user',userhan);
app.use('/api/form',Formin);
app.use('/api/log',gog);
app.use('/api/payment',rou)
app.use('/api/pro',rro)
app.use('/api/admin',roog)
app.use('/api/works', worksRouter);
app.use('/api/business-enquiries', businessEnquiryRoutes);
app.use('/api/chat', chatRoutes);

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  console.error("STACK:", err.stack);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "production"
      ? undefined
      : err.stack
  });
});


const port=process.env.PORT||3000;

app.listen(port,()=>console.log(`be running on${port}`));
