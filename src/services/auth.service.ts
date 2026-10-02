import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { HttpError } from "@/lib/http-error";
import { UserModel } from "@/models/user.model";
import { RoleModel } from "@/models/role.model";
import { ROLES } from "@/constants/roles";
import type { LoginInput, RegisterInput } from "@/validations/auth.validation";
import { generateTokens } from "@/lib/jwt";
export async function registerUser(input: RegisterInput) {
    await connectDB();

    const existingUser = await UserModel.findOne({
        email: input.email,
    });

    if (existingUser) {
        throw new HttpError(
            409,
            "User with this email already exists",
        );
    }

    const userRole = await RoleModel.findOne({
        name: ROLES.USER,
    });

    if (!userRole) {
        throw new HttpError(
            500,
            "Default user role is not configured",
        );
    }

    const passwordHash = await bcrypt.hash(
        input.password,
        12,
    );

    const user = await UserModel.create({
        name: input.name,
        email: input.email,
        passwordHash,
        roleId: userRole._id,
    });
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: userRole.name,
    };
}
export async function loginUser(input: LoginInput) {
    // conncet db
    // get user and role
    // compare passowrd
    // generate tokens 
    // return user
    await connectDB()

    const user = await UserModel.findOne({ email: input.email }).select("+passwordHash");
    if (!user) {
        throw new HttpError(401, 'Invalid email or password')
    }
    const isPasswordCorrect = await bcrypt.compare(input.password, user.passwordHash);
    if (!isPasswordCorrect) {
        throw new HttpError(401, 'Invalid email or password');
    }
    const role = await RoleModel.findById(user.roleId);
    const { accessToken, refreshToken } = await generateTokens({ id: user._id.toString(), role: role.name })
    return {
        user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: role.name,
        },
        accessToken, refreshToken
    }
}