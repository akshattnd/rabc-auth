import { apiHandler } from "@/lib/apiHandler";
import { HttpError } from "@/lib/http-error";
import { loginUser } from "@/services/auth.service";
import { loginSchema } from "@/validations/auth.validation";

export const POST = apiHandler(async (req: Request) => {
    const { data, success, error } = loginSchema.safeParse(await req.json())
    if (!success) {
        console.log(error.flatten().fieldErrors);
        throw new HttpError(400, 'validation Error')
    }
    const user = await loginUser(data);
    return {
        message: 'user logged in',
        statusCode: 200,
        data: user,
    }
})