import express from "express"
import { chat } from "../controllers/counsellor.controller.js"
const router=express.Router()

router.post('/',chat)

export default router
