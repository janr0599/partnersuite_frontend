// import { formatDate } from "@/utils/utils";
// import { useAuth } from "@/hooks/useAuth";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { deleteNote } from "@/api/noteAPI";
// import { toast } from "react-toastify";
import { useMemo, useState } from "react";
// import { useLocation, useParams } from "react-router-dom";

import { Comment } from "@/types/commentsTypes";
import AddCommentform from "./AddCommentform";

type CommentDetailProps = {
    comment: Comment;
};

function CommentDetails({ comment }: CommentDetailProps) {
    // const { data, isLoading } = useAuth();
    // const canDelete = useMemo(() => data?._id === note.createdBy._id, [data]);
    const [editingComment, setEditingComment] = useState<Comment | null>(null);
    // const location = useLocation();
    // const queryParams = new URLSearchParams(location.search);
    // const ticketId = queryParams.get("viewTicket")!;
    // const queryClient = useQueryClient();

    // const { mutate: mutateDeleteComment } = useMutation({
    //     mutationFn: deleteComment,
    //     onError: (error) => {
    //         toast.error(error.message);
    //     },
    //     onSuccess: (message) => {
    //         toast.success(message);
    //         queryClient.invalidateQueries({
    //             queryKey: ["ticket", ticketId],
    //         });
    //     },
    // });

    // const handleDeleteComment = () => {
    //     if (confirm("Are you sure you want to delete this note?")) {
    //         mutateDeleteComment({
    //             taskId,
    //             commentId: comment._id,
    //         });
    //     }
    // };

    // const handleEditComment = () => {
    //     setEditingComment(comment);
    // };

    // if (isLoading) return "Loading...";

    // if (data)
    return (
        <div key={comment._id} className="">
            {!editingComment ? (
                <div className="p-3 flex justify-between items-center">
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
                    {/* {canDelete && (
                            <div className="inline-flex gap-x-2">
                                <button onClick={handleEditComment}>
                                    Edit icon
                                </button>
                                <button onClick={handleDeleteComment}>
                                    Delete Icon
                                </button>
                            </div>
                        )} */}
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
