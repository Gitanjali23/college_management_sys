import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "student" | "teacher" | "admin";
  studentId?: string; // For students
  branch?: string;    // For students
  department?: string; // For teachers
  designation?: string; // For teachers
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      required: true,
    },
    // Student specific fields
    studentId: { type: String, required: false },
    branch: { type: String, required: false },
    // Teacher specific fields
    department: { type: String, required: false },
    designation: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

// In Next.js, models can get cached with old schemas during development.
// This ensures we always use the latest schema definition.
if (mongoose.models && mongoose.models.User) {
  delete (mongoose as any).models.User;
}

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
