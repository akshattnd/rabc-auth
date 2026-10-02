import { Schema, model, models, InferSchemaType, HydratedDocument } from "mongoose";

const roleSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true,
    },

    description: {
        type: String,
        trim: true,
    },

    permissions: [
        {
            type: Schema.Types.ObjectId,
            ref: "Permission",
        },
    ],
}, { 
        timestamps: true
    });
export type Role = InferSchemaType<typeof roleSchema>
export type RoleDocument = HydratedDocument<Role>
export const RoleModel = models.Role || model<RoleDocument>('Role', roleSchema)