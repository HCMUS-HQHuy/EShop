import { ZodObject } from "zod";

function validateData(data: any, schema: ZodObject) {
    const parsedBody = schema.safeParse(data);
    if (!parsedBody.success) {
        return {
            message: "error",
            error: true, 
            data: [parsedBody.error.format()]
        }
    }
    return null;
}

export default validateData;