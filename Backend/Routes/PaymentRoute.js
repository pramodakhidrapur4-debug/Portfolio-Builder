import {key,verifyPayment,CreateOrder} from '../Controllers/PaymentController.js'
import express, { Router } from 'express'

const rou=express.Router();

rou.get('/getkey',key)
rou.post('/PaymentVerifi',verifyPayment)
rou.post('/paymentOrder',CreateOrder);
export default rou;