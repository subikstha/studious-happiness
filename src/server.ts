import express from "express";
import authRoutes from "./routes/authRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";
import habitRoutes from "./routes/habitRoutes.ts";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { isTest } from "../env.ts";

const app = express();
app.use(helmet());
app.use(
  cors({
    origin: "*",
  }),
); // This is actually enable all origin
app.use(express.json()); // Ensure that you get the JSON payload sent by client inside of handlers and middleware using req.body()
app.use(express.urlencoded({ extended: true })); // some fix for query string
app.use(
  morgan("dev", {
    skip: () => isTest(),
  }),
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/health", (req, res) => {
  res
    .json({
      message: "world",
    })
    .status(200);
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/habits", habitRoutes);

export { app };

export default app;
