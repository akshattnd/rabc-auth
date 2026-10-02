
import { apiHandler } from "@/lib/apiHandler";
import { connectDB } from "@/lib/mongodb";
export const GET = apiHandler(async (request: Request) => {
    await connectDB()
    return {
        message: 'ok',
        data: {
            database: 'connected successfully'
        }
    }
})