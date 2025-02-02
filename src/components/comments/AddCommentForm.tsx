import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ErrorMessage from "../ErrorMessage";
import { useLocation } from "react-router-dom";
import { Comment, CommentFormData } from "@/types/commentsTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentFormSchema } from "@/schemas/commentsSchema";
import { createComment, updateComment } from "@/api/commentsAPI";
import { Ticket } from "@/types/ticketsTypes";

type AddCommentFormProps = {
    comment?: Comment; // Optional for editing
    onCancel?: () => void; // Optional cancel function
    ticket?: Ticket;
};

function AddCommentform({ comment, onCancel, ticket }: AddCommentFormProps) {
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const ticketId = queryParams.get("viewTicket")!;

    const initialValues: CommentFormData = {
        content: comment ? comment.content : "",
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CommentFormData>({
        defaultValues: initialValues,
        resolver: zodResolver(commentFormSchema),
    });

    const queryClient = useQueryClient();
    const { mutate: mutateCreateComment } = useMutation({
        mutationFn: createComment,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (message) => {
            toast.success(message);
            queryClient.invalidateQueries({
                queryKey: ["ticket", ticketId],
            });
            reset();
            onCancel && onCancel();
        },
    });

    const { mutate: mutateUpdateNote } = useMutation({
        mutationFn: updateComment,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (message) => {
            toast.success(message);
            queryClient.invalidateQueries({
                queryKey: ["ticket", ticketId],
            });
            reset();
            onCancel && onCancel();
        },
    });

    const handleAddOrUpdateComment = (formData: CommentFormData) => {
        if (comment) {
            mutateUpdateNote({
                ticketId,
                commentId: comment._id,
                formData,
            });
        } else {
            mutateCreateComment({ ticketId, formData });
        }
    };

    return (
        <form
            onSubmit={handleSubmit(handleAddOrUpdateComment)}
            className={`${comment ? "mb-6" : "pb-3"} space-y-3`}
            noValidate
        >
            <label htmlFor="content" className="font-bold text-sm md:text-base">
                {comment ? "" : "Make a comment:"}
            </label>
            <div>
                {errors.content && (
                    <ErrorMessage>{errors.content.message}</ErrorMessage>
                )}
                <div className="flex flex-col gap-3 md:flex-row justify-between p-1">
                    <input
                        id="content"
                        type="text"
                        placeholder="Enter your comment"
                        className="w-full p-2 bg-white border border-gray-300 rounded-lg"
                        {...register("content")}
                        disabled={ticket?.status === "closed"}
                    />
                    <input
                        type="submit"
                        value={comment ? "Update" : "Add comment"}
                        className={` ${comment ? "text-sm" : "text-base"} ${
                            ticket?.status === "closed"
                                ? "opacity-50 hover:opacity-50 cursor-not-allowed"
                                : "cursor-pointer hover:opacity-80"
                        } w-full px-4 py-2 font-bold bg-black text-white rounded-lg transition-opacity md:w-1/4 text-sm md:text-base`}
                        disabled={ticket?.status === "closed"}
                    />
                    {comment && (
                        <button
                            onClick={onCancel}
                            className="text-black w-full p-2 rounded-lg font-bold bg-slate-200 hover:bg-slate-300 transition-colors md:w-1/4 text-sm md:text-base"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
}

export default AddCommentform;
