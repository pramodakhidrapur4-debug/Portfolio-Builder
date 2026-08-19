import express from 'express'
import {prof} from '../Controllers/Profile.js'
import authmid from '../Middleware/Auth.js'
import {proj} from '../Controllers/Profile.js'
const rro=express.Router();

rro.get('/profile',authmid,prof);
rro.get('/port-link',authmid,proj)
export default rro;