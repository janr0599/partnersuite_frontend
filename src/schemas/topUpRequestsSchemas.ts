import z from "zod";
import { authenticatedUserSchema } from "./authSchemas";

export const topUpRequestStatusSchema = z.enum([
    "Pending",
    "Approved",
    "Rejected",
]);

export const topUpRequestSchema = z.object({
    _id: z.string(),
    createdBy: authenticatedUserSchema,
    BonusAmount: z.number(),
    status: topUpRequestStatusSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const topUpRequestsSchema = z.array(topUpRequestSchema);
