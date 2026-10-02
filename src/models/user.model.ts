import { Schema, model, models, InferSchemaType, HydratedDocument } from "mongoose";

const userSchema = new Schema({

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    roleId: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
}, { 
        timestamps: true
    });
export type User = InferSchemaType<typeof userSchema>
export type UserDocument = HydratedDocument<User>
export const UserModel = models.User || model<UserDocument>('User', userSchema)