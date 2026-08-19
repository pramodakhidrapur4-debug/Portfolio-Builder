import {googleLogin} from '../Controllers/GoogleController.js'
import express from 'express'

const gog=express.Router();

gog.get('/googleLog',googleLogin);

export default gog;