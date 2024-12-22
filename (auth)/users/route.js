import connectDB from "@/server/database/db";
import { NextResponse } from "next/server";
import { User } from "@/server/models/user";
import { Types } from "mongoose";

const objectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
  try {
    await connectDB();

    const users = await User.find();

    return new NextResponse(JSON.stringify(users));
  } catch (error) {
    return new NextResponse.json("Failed to fetch users" + error.message);
  }
};

export const POST = async (req) => {
  try {
    const body = await req.json();
    await connectDB();

    const newUser = new User(body);
    await newUser.save();

    return new NextResponse(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    return new NextResponse.json("Failed to create user" + error.message, {
      status: 500,
    });
  }
};

export const PATCH = async (req) => {
  try {
    const body = await req.json();
    const { id, username, email } = body;

    await connectDB();

    if (!id || !username || !email) {
      return new NextResponse(
        JSON.stringify("Missing required fields", { status: 400 })
      );
    }

    const isValidId = objectId.isValid(id);

    if (!isValidId) {
      return new NextResponse(JSON.stringify("Invalid ID", { status: 400 }));
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      //
      { username: username, email: email },
      { new: true }
    );

    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify("User not found", { status: 404 })
      );
    }

    return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify("Failed to update user" + error.message, {
        status: 500,
      })
    );
  }
};

export const DELETE = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse(
        JSON.stringify("Missing required field ID", { status: 400 })
      );
    }

    const isValidId = objectId.isValid(id);

    if (!isValidId) {
      return new NextResponse(JSON.stringify("Invalid ID", { status: 400 }));
    }

    await connectDB();

    const deletedUser = await User.findByIdAndDelete(new Types.ObjectId(id));

    if (!deletedUser) {
      return new NextResponse(
        JSON.stringify("User not found", { status: 404 })
      );
    }

    return new NextResponse(
      JSON.stringify("User deleted successfully" + deletedUser, { status: 200 })
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify("Failed to delete user" + error.message, {
        status: 500,
      })
    );
  }
};
