import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/connectDB.js"
import authRoutes from "./routes/auth.route.js"
import aiRoutes from "./routes/ai.route.js"
import prescriptionRoutes from "./routes/prescription.route.js"
import hospitalRoutes from "./routes/hospital.route.js"

dotenv.config()
const app=express()
const PORT=process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',authRoutes)
app.use("/api/ai",aiRoutes)
app.use("/api/prescription",prescriptionRoutes)
app.use("/api/routes",hospitalRoutes) 

app.listen(PORT,()=>{
    connectDB()
    console.log(`Server is running on port ${PORT}`)
})
