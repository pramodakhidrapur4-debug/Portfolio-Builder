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
const app=express();

//middleware

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174"
  ],
  credentials: true
}));
Mongo();


app.use('/api/user',userhan);
app.use('/api/form',Formin);
app.use('/api/log',gog);
app.use('/api/payment',rou)
app.use('/api/pro',rro)
app.use('/api/admin',roog)




const port=process.env.PORT||3000;

app.listen(port,()=>console.log(`be running on${port}`));
