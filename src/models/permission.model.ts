import { Schema, model, models, InferSchemaType, HydratedDocument } from "mongoose";


const permissionSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);
export type Permission = InferSchemaType<typeof permissionSchema>
export type PermissionDocument = HydratedDocument<Permission>
export const PermissionModel =
    models.Permission ||
    model<PermissionDocument>("Permission", permissionSchema);