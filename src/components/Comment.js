import { useEffect, useRef } from "react";
import "./Comment.css";

function Comment({ comment }) {
  const commentTextEl = useRef(null);

  const nestedComments = comment.children.map((comment) => {
    return <Comment key={comment.id} comment={comment} />;
  });

  useEffect(() => {
    commentTextEl.current.innerHTML = comment.text;
  }, []);

  return (
    <div style={{ marginLeft: "2rem", marginTop: "0.5rem" }}>
      <div ref={commentTextEl} className="comment"></div>

      {nestedComments}
    </div>
  );
}

export default Comment;
