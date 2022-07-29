import "./cardPost.css";
import { Link } from "react-router-dom";

function CardPost({ title, url, objectID }) {
  return (
    <article className="card">
      <p>{url}</p>
      <Link to={"/post/" + objectID}>
        <h2>{title}</h2>
      </Link>
    </article>
  );
}

export default CardPost;
