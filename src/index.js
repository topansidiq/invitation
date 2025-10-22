import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import guestRouter from "./routes/guestRoute.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.send('API Invitation App is ready!');
});
app.use('/guests', guestRouter);

const PORT = process.env.PORT || 4021;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));