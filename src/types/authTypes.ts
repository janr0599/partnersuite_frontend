import {
    authenticatedUserSchema,
    forgotPasswordSchema,
    newPasswordSchema,
    requestConfirmationCodeSchema,
    tokenSchema,
    userLoginSchema,
    userRegistrationSchema,
} from "@/schemas/authSchemas";
import { z } from "zod";

export type AuthenticatedUser = z.infer<typeof authenticatedUserSchema>;
export type UserLoginForm = z.infer<typeof userLoginSchema>;
export type UserRegistrationForm = z.infer<typeof userRegistrationSchema>;

export type ConfirmToken = z.infer<typeof tokenSchema>;
export type RequestConfirmationCodeForm = z.infer<
    typeof requestConfirmationCodeSchema
>;
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
export type NewPasswordForm = z.infer<typeof newPasswordSchema>;
