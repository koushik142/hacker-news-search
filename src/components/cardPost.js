import "./cardPost.css";

function CardPost({ title, url }) {
  return (
    <article className="card">
      <p>{url}</p>
      <a href={url}>
        <h2>{title}</h2>
      </a>
    </article>
  );
}

export default CardPost;
