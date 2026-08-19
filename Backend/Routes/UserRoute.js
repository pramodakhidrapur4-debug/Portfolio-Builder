import express from 'express'
import {login,sign,verif} from '../Controllers/userController.js'
import authmid from '../Middleware/Auth.js'
const userhan=express.Router();

userhan.post('/signin',sign);
userhan.post('/login',login);
userhan.post('/veri',verif);


export default userhan;