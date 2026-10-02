import { apiHandler } from "@/lib/apiHandler";
import { HttpError } from "@/lib/http-error";
import { registerUser } from "@/services/auth.service";
import { registerSchema } from "@/validations/auth.validation";
import { request } from "node:http";

export const POST = apiHandler(async (req: Request) => {
    const { data, success, error } = registerSchema.safeParse(await req.json())
    if (!success) {
        console.log(error.flatten().fieldErrors);
        throw new HttpError(400, 'validation Error')
    }
    const user = await registerUser(data);
    return {
        message: 'user regiseted',
        statusCode: 201,
        data: user,
    }
})