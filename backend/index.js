import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/connectDB.js"
import authRoutes from "./routes/auth.route.js"
import aiRoutes from "./routes/ai.route.js"
import nearbyHospital from "./routes/nearby.route.js"
import hospitalRoutes from "./routes/hospital.route.js"
import doctorRoutes from "./routes/doctor.route.js"
import appointmentRoutes from "./routes/appointment.route.js"
import cors from "cors"

dotenv.config()
const app=express()
const PORT=process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true,
}));

app.use('/api/auth',authRoutes)
app.use("/api/ai",aiRoutes) 
app.use("/api/nearby",nearbyHospital)  

app.use("/api/hospital",hospitalRoutes)
app.use("/api/doctor",doctorRoutes)
app.use("/api/appointment",appointmentRoutes)


app.listen(PORT,()=>{
    connectDB()
    console.log(`Server is running on port ${PORT}`)
})
