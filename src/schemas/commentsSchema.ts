import z from "zod";

export const commentSchema = z.object({
    content: z.string().trim().min(1, "The comment cannot be empty"),
    // createdBy: z.string(),
    ticket: z.string(),
    _id: z.string(),
});

export const commentFormSchema = commentSchema.pick({
    content: true,
});
