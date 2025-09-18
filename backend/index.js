import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import urlRoutes from "./routes/urlRoutes.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
const port = process.env.PORT || 5000;

connectDB();

app.use('/api/urls', urlRoutes);


if (process.env.NODE_ENV === "production") {
  const frontendPath = join(__dirname, "..", "frontend", "dist");

  app.use(express.static(frontendPath, { fallthrough: true }));

  app.use((req, res, next) => {
    if (!req.path.startsWith("/api")) {
      res.sendFile(join(frontendPath, "index.html"));
    } else {
      next();
    }
  });
} else {
  app.get("/", (req, res) => {
    res.send("Server running in development mode");
  });
}


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});



app.listen(port, () =>{
    console.log(`Server started on http://localhost:${port} in ${process.env.NODE_ENV} mode`);
});