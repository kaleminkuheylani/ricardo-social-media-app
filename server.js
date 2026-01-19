import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// TODO 1: Hazırladığın rota dosyalarını import et.
import authRoutes from "./routes/usersRoutes.js";
import postRoutes from "./routes/postsRoutes.js";

dotenv.config();

const app = express();

// Middleware'ler
app.use(express.json()); // JSON verilerini okumak için
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Güvenlik ayarı (Front-end'in bağlanması için)

// ======================================================================
// ROTALARI BAĞLA (MOUNTING ROUTES)
// ======================================================================

// TODO 2: Auth rotalarını '/api/auth' adresine bağla.
app.use("/api/auth",authRoutes);

// TODO 3: Post rotalarını '/api/posts' adresine bağla.
app.use("/api/posts",postRoutes);


// ======================================================================
// VERİTABANI BAĞLANTISI VE SUNUCU BAŞLATMA
// ======================================================================

const PORT = process.env.PORT || 5000;

// TODO 4: Mongoose ile veritabanına bağlan.
// (İpucu: process.env.MONGO_URL kullanmalısın)
const connectDB=await mongoose.connect(process.env.MONGODB_URI)
.then(()=>console.log("sasa"))
.catch((error) => console.log(`${error} - Bağlantı Hatası`));
app.listen(PORT,()=>{
    connectDB,
    console.log(`The server is running${PORT}`)
})