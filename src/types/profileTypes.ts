import {
    changePasswordSchema,
    userProfileSchema,
} from "@/schemas/profileSchemas";
import { z } from "zod";

export type UserProfileForm = z.infer<typeof userProfileSchema>;
export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;
