import { ZodObject } from "zod";

function validateData(data: any, schema: ZodObject) {
    const parsedBody = schema.safeParse(data);
    if (!parsedBody.success) {
        return new Error(String(parsedBody.error.format()))
    }
    return parsedBody.data;
}

export default validateData;