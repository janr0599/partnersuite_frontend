import { Ticket } from "@/types/ticketsTypes";
import AddCommentform from "./AddCommentform";
import CommentDetails from "./CommentDetails";

type CommentsPanelProps = {
    comments: Ticket["comments"];
};

function CommentsPanel({ comments }: CommentsPanelProps) {
    return (
        <>
            <div className="divide-y divide-gray-300 my-10">
                {comments.length ? (
                    <>
                        <p className="font-bold text-2xl mb-5 text-center">
                            Comments
                        </p>
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
            <AddCommentform />
        </>
    );
}

export default CommentsPanel;
