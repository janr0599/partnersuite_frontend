// import { formatDate } from "@/utils/utils";
// import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Comment } from "@/types/commentsTypes";
import { deleteComment } from "@/api/commentsAPI";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import AddCommentform from "./AddCommentform";
import Swal from "sweetalert2";

type CommentDetailProps = {
    comment: Comment;
};

function CommentDetails({ comment }: CommentDetailProps) {
    // const { data, isLoading } = useAuth();
    // const canDelete = useMemo(() => data?._id === note.createdBy._id, [data]);\
    const canDelete = true;
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
            text: "Are you sure you want to delete this comment?",
            showCancelButton: true,
            confirmButtonColor: "#000",
            confirmButtonText: "Yes, delete",
            customClass: {
                cancelButton:
                    "text-red-500 bg-transparent hover:bg-slate-200 transition-colors",
                confirmButton: "hover:opacity-80 transition-opacity",
                popup: "w-[300px] md:w-[500px] text-sm md:text-base",
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

    // if (isLoading) return "Loading...";

    // if (data)
    return (
        <div key={comment._id} className="">
            {!editingComment ? (
                <div className="py-3 flex justify-between items-center">
                    <div>
                        <p className="text-sm">
                            {comment.content}{" "}
                            {/* <span className="text-slate-400 text-sm">
                                    ({comment.createdBy.name})
                                </span> */}
                        </p>
                        {/* <p className="text-sm text-slate-400">
                                {formatDate(comment.createdAt)}
                            </p> */}
                    </div>
                    {canDelete && (
                        <div className="inline-flex gap-x-2">
                            <button onClick={handleEditComment}>
                                <FiEdit className="size-5 hover:text-indigo-500 transition-colors" />
                            </button>
                            <button onClick={handleDeleteComment}>
                                <FiTrash2 className="size-5 hover:text-red-500 transition-colors" />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <AddCommentform
                    comment={editingComment}
                    onCancel={() => setEditingComment(null)}
                />
            )}
        </div>
    );
}

export default CommentDetails;
