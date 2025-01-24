import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import notesRoutes from "./routes/notesRoute.js"
import commentRoutes from "./routes/commentsRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"

dotenv.config();

const app=express();
const PORT=process.env.PORT||8000;


app.use(cors());
app.use(express.json({limit:"50mb"}));


app.use("/api/user",authRoutes);
app.use("/api/notes",notesRoutes);
app.use("/api/comments",commentRoutes);
app.use("/api/admin",adminRoutes)


app.get("/",(req,res)=>{
    res.send("https://peer-notes-frontend.vercel.app/")
})

app.listen(PORT,(req,res)=>{ 
    console.log(`Server is running at ${PORT}`);
})