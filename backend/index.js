import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import urlRoutes from "./routes/urlRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 5000;

connectDB();

app.get('/', (req, res) => {
    res.send('server running');
})

app.use('/api/urls', urlRoutes);



app.listen(port, () =>{
    console.log(`Server started at http://localhost:${port}`);
});