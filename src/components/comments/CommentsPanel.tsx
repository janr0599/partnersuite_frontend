import { Ticket } from "@/types/ticketsTypes";
import AddCommentForm from "./AddCommentForm";
import CommentDetails from "./CommentDetails";

type CommentsPanelProps = { comments: Ticket["comments"]; ticket: Ticket };

function CommentsPanel({ comments, ticket }: CommentsPanelProps) {
    return (
        <>
            <div className="my-6 overflow-y-auto max-h-52 md:max-h-72">
                {comments.length ? (
                    <>
                        {comments.map((comment) => (
                            <CommentDetails
                                comment={comment}
                                key={comment._id}
                            />
                        ))}
                    </>
                ) : (
                    <p className="text-center text-gray-500 pt-3">
                        No comments yet
                    </p>
                )}
            </div>
            <AddCommentForm ticket={ticket} />
        </>
    );
}
export default CommentsPanel;
