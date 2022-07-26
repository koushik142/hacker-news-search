import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Comment from "./Comment";
import "./PostDetail.css";
import Footer from "./Footer";

// Definition of Data Structures used
/**
 * @typedef {Object} post - Data on post displayed on the post detail. Definition provided below only for properties being used
 *
 * @property {number} points - post's points
 * @property {string} title - Title of the post
 * @property {Array} children - comments on the post
 */

function PostDetail() {
  const params = useParams();
  const [post, setPost] = useState({});
  const [displayLoadingSpinner, setDisplayLoadingSpinner] = useState(false);
  const [axiosGetRequestFailed, setAxiosGetRequestFailed] = useState(false);

  /**
   * Make API call to the endpoint provided to fetch the post details object.
   *
   * @returns {post}
   *        post object
   */
  async function getPost(objectID) {
    const response = await axios.get(
      "https://hn.algolia.com/api/v1/items/" + objectID
    );
    return response.data;
  }

  useEffect(() => {
    setDisplayLoadingSpinner(true);
    getPost(params.id)
      .then((res) => {
        setDisplayLoadingSpinner(false);
        setAxiosGetRequestFailed(false);
        console.log(res);
        setPost(res);
      })
      .catch((err) => {
        console.log(err.message);
        setDisplayLoadingSpinner(false);
        setAxiosGetRequestFailed(true);
      });
  }, []);

  //If axios GET request fails, display an error message to the user by returning the below JSX
  if (axiosGetRequestFailed) {
    return (
      <>
        <h2>Comments</h2>
        <div id="axios-err-msg">
          <h5>
            Cannot fetch data at the moment. Try refreshing or open the app
            after some time.
          </h5>
        </div>
      </>
    );
  }

  return (
    <>
      <h1>{post.title}</h1>
      <h2>
        Points:{" "}
        <span className="green-text">
          <i>{post.points ? post.points : ""}</i>
        </span>
      </h2>
      <h2>Comments</h2>

      {displayLoadingSpinner ? (
        <Box className="loading">
          <CircularProgress />
          <Typography variant="h5">Loading comments</Typography>
        </Box>
      ) : (
        <div id="comments">
          {post.children &&
            post.children.map((comment) => {
              return <Comment key={comment.id} comment={comment} />;
            })}
        </div>
      )}

      <Footer />
    </>
  );
}

export default PostDetail;
