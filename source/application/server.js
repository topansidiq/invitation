import express from "express";
import guestRouter from "../routes/guest.js";
const app = express();

app.use(express.json());

app.get('/', (req, res) => { res.send('API invitation ready!') });
app.use('/api/guest', guestRouter);

export default app