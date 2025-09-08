import schemas from 'src/schemas/index.schema';
import z from 'zod'

export type UserInfor = z.infer<typeof schemas.user.infor>;
export type UpdateUserStatusRequest = z.infer<typeof schemas.user.updateStatus>;