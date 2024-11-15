import {
    authenticatedUserSchema,
    userLoginSchema,
    userRegistrationSchema,
} from "@/schemas/authSchemas";
import { z } from "zod";

export type AuthenticatedUser = z.infer<typeof authenticatedUserSchema>;
export type UserLoginForm = z.infer<typeof userLoginSchema>;
export type UserRegistrationForm = z.infer<typeof userRegistrationSchema>;
