import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import noteRoutes from "./routes/notes.js";
import path from "path";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use('/api/users', authRoutes);
app.use('/api/notes', noteRoutes);

const __dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/dist')));
    app.get('*', (req, res) => 
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
    );
}

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});