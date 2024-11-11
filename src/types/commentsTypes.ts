import { commentFormSchema, commentSchema } from "@/schemas/commentsSchema";
import { z } from "zod";
import { Ticket } from "./ticketsTypes";

export type Comment = z.infer<typeof commentSchema>;
export type CommentFormData = z.infer<typeof commentFormSchema>;
export type CommentAPIType = {
    formData: CommentFormData;
    ticketId: Ticket["_id"];
    commentId: Comment["_id"];
};
