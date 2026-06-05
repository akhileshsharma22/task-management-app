import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";

const port = process.env.PORT || 5000;

const start = async () => {
  if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
    throw new Error("MONGODB_URI and JWT_SECRET environment variables are required");
  }

  await connectDatabase();
  const server = app.listen(port, () => console.log(`API listening on port ${port}`));

  const shutdown = (signal) => {
    console.log(`${signal} received. Shutting down gracefully.`);
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
