import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connectionState = mongoose.connection.readyState;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

const connectDB = async () => {
  if (connectionState === 1) {
    console.log("Connected to MongoDB");
    return;
  }

  if (connectionState === 2) {
    console.log("connecting...");
    return;
  }

  try {
    mongoose.connect(MONGODB_URI, {
      dbName: "nextjs-CRUD",
      bufferCommands: true,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to connect to MongoDB");
  }
};

export default connectDB;
