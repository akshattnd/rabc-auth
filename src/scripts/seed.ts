import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { PermissionModel as Permission } from "@/models/permission.model";
import { RoleModel as Role } from "@/models/role.model";
import { PERMISSIONS } from "@/constants/permissions";
import { ROLES } from "@/constants/roles";

async function seed() {
    await connectDB();

    console.log("Seeding database...");

    // -----------------------------
    // Permissions
    // -----------------------------

    const permissionData = [
        {
            name: PERMISSIONS.USERS_READ,
            description: "View users",
        },
        {
            name: PERMISSIONS.USERS_CREATE,
            description: "Create users",
        },
        {
            name: PERMISSIONS.USERS_UPDATE,
            description: "Update users",
        },
        {
            name: PERMISSIONS.USERS_DELETE,
            description: "Delete users",
        },
        {
            name: PERMISSIONS.ROLES_READ,
            description: "View roles",
        },
        {
            name: PERMISSIONS.ROLES_CREATE,
            description: "Create roles",
        },
        {
            name: PERMISSIONS.ROLES_UPDATE,
            description: "Update roles",
        },
        {
            name: PERMISSIONS.ROLES_DELETE,
            description: "Delete roles",
        },
    ];

    const permissions = await Permission.insertMany(
        permissionData,
        {
            ordered: false,
        },
    ).catch(async () => {
        return Permission.find({
            name: {
                $in: permissionData.map((permission) => permission.name),
            },
        });
    });

    const permissionMap = new Map(
        permissions.map((permission) => [
            permission.name,
            permission._id,
        ]),
    );

    // -----------------------------
    // Roles
    // -----------------------------

    await Role.findOneAndUpdate(
        { name: ROLES.ADMIN },
        {
            name: ROLES.ADMIN,
            description: "Full system access",
            permissions: [...permissionMap.values()],
        },
        {
            upsert: true,
            returnDocument: 'after',
        },
    );

    await Role.findOneAndUpdate(
        { name: ROLES.MODERATOR },
        {
            name: ROLES.MODERATOR,
            description: "Moderation access",
            permissions: [
                permissionMap.get(PERMISSIONS.USERS_READ),
                permissionMap.get(PERMISSIONS.ROLES_READ),
            ].filter(Boolean),
        },
        {
            upsert: true,
            returnDocument: 'after',
        },
    );

    await Role.findOneAndUpdate(
        { name: ROLES.USER },
        {
            name: ROLES.USER,
            description: "Basic user access",
            permissions: [
                permissionMap.get(PERMISSIONS.USERS_READ),
            ].filter(Boolean),
        },
        {
            upsert: true,
            returnDocument: 'after',
        },
    );

    console.log("Database seeded successfully.");

    await mongoose.disconnect();
}

seed().catch(async (error) => {
    console.error("Seed failed:", error);
    await mongoose.disconnect();
    process.exit(1);
});