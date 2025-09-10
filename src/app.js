// app.js
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import apiRoutes from "./routes/index.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Core Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend
app.use(express.static(path.join(__dirname, "../public")));

// API Routes
app.use("/api", apiRoutes);

app.use(errorHandler);

// Fallback for frontend routes (except /api)
//app.get(/^\/(?!api).*/, (req, res) => {
  //res.sendFile(path.join(__dirname, "../public", "index.html"));
//});

export default app;