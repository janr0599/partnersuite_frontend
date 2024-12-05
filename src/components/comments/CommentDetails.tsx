import { formatDate } from "@/utils/utils";
import { useAuth } from "@/hooks/useauth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Comment } from "@/types/commentsTypes";
import { deleteComment } from "@/api/commentsAPI";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import AddCommentForm from "./AddCommentForm";
import Swal from "sweetalert2";

type CommentDetailProps = {
    comment: Comment;
};

function CommentDetails({ comment }: CommentDetailProps) {
    const { data, isLoading } = useAuth();
    const canDelete = useMemo(
        () => data?._id === comment.createdBy._id,
        [data, comment]
    );

    const updatedComment = useMemo(
        () => comment.createdAt !== comment.updatedAt,
        [comment]
    );

    const [editingComment, setEditingComment] = useState<Comment | null>(null);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const ticketId = queryParams.get("viewTicket")!;
    const queryClient = useQueryClient();

    const { mutate: mutateDeleteComment } = useMutation({
        mutationFn: deleteComment,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (message) => {
            toast.success(message);
            queryClient.invalidateQueries({
                queryKey: ["ticket", ticketId],
            });
        },
    });

    const handleDeleteComment = () => {
        Swal.fire({
            title: "Delete comment?",
            text: "This cannot be undone",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            confirmButtonText: "Delete",
            reverseButtons: true,
            customClass: {
                cancelButton:
                    "text-black bg-slate-200 hover:bg-slate-300 transition-colors",
                confirmButton: "hover:bg-red-600 transition-colors",
                popup: "w-[300px] md:w-[400px] text-sm md:text-base rounded-md",
                title: "text-black font-bold text-left text-lg w-full p-3 rounded-md",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                mutateDeleteComment({
                    ticketId,
                    commentId: comment._id,
                });
            }
        });
    };

    const handleEditComment = () => {
        setEditingComment(comment);
    };

    if (isLoading) return "Loading...";

    if (data)
        return (
            <div key={comment._id} className="">
                {!editingComment ? (
                    <div
                        className={`flex w-full ${
                            canDelete ? "justify-end" : "justify-start"
                        }`}
                    >
                        <div
                            className={`max-w-[80%] px-4 py-2 rounded-lg mt-8 relative ${
                                canDelete ? "bg-indigo-100" : "bg-gray-100"
                            }`}
                        >
                            {!canDelete && (
                                <p className="absolute -top-5 left-1 text-xs text-slate-400">
                                    {comment.createdBy.name}
                                </p>
                            )}
                            <div className="space-y-1">
                                <p className="text-sm break-words">
                                    {comment.content}
                                </p>
                                <div className="flex items-center justify-between gap-6">
                                    <div className="flex">
                                        <p className="text-xs text-slate-400">
                                            {formatDate(comment.createdAt)}
                                            {""}
                                        </p>
                                        <p className="text-slate-400 text-xs">
                                            {updatedComment && (
                                                <span className="text-slate-400 text-x ml-1">
                                                    - edited
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    {canDelete && (
                                        <div className="flex gap-x-2 justify-end">
                                            <button onClick={handleEditComment}>
                                                <FiEdit className="size-4 hover:text-indigo-500 transition-colors" />
                                            </button>
                                            <button
                                                onClick={handleDeleteComment}
                                            >
                                                <FiTrash2 className="size-4 hover:text-red-500 transition-colors" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <AddCommentForm
                        comment={editingComment}
                        onCancel={() => setEditingComment(null)}
                    />
                )}
            </div>
        );
}

export default CommentDetails;
