
import { apiHandler } from "@/lib/apiHandler";
import { connectDB } from "@/lib/mongodb";
export const GET = apiHandler(async (request: Request) => {
    const res = await connectDB();
    console.log(res)
    return {
        message: 'ok',
        data:res.ConnectionStates
    }
})