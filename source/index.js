import app from "./application/server.js";
import dotenv from 'dotenv';
dotenv.config();
app.listen(process.env.PORT, () => { console.log(`Server running at http://${process.env.URL}:${process.env.PORT}`) });