import "./Home.css";
import CardPost from "./CardPost";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Header from "./Header";
import SearchBar from "./SearchBar";
import Footer from "./Footer";

// Definition of Data Structures used
/**
 * @typedef {Object} post - Data on posts displayed on the home screen. Definition provided below only for properties being used
 *
 * @property {number} objectID - Unique id of the post
 * @property {string} title - Title of the post
 * @property {string} url - url of the post
 */

/**
 * @typedef {Array.<post>} posts - Array of post objects
 */

function Home() {
  const [posts, setPosts] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(0);
  const [displayLoadingSpinner, setDisplayLoadingSpinner] = useState(false);
  const [axiosGetRequestFailed, setAxiosGetRequestFailed] = useState(false);

  /**
   * Make API call to the endpoint provided to fetch the posts Array.
   *
   * @returns {Array.<post>}
   *        Array of posts along with their properties
   */
  async function getPosts(query) {
    const response = await axios.get(
      "https://hn.algolia.com/api/v1/search?query=" + query
    );
    return response.data;
  }

  /**
   * "Search bar" on change handler. Updates search string state. Makes Axios GET request to fetch * posts data using debouncing.
   */
  function handleChangeSearchString(e) {
    const userInput = e.target.value;
    setSearchString(userInput);

    //debouncing implementation
    if (debounceTimeout !== 0) {
      clearTimeout(debounceTimeout);
    }
    const newTimeout = setTimeout(() => {
      setDisplayLoadingSpinner(true);
      getPosts(userInput)
        .then((res) => {
          setDisplayLoadingSpinner(false);
          setAxiosGetRequestFailed(false);
          console.log(res);
          setPosts(res.hits);
        })
        .catch((err) => {
          console.log(err.message);
          setDisplayLoadingSpinner(false);
          setAxiosGetRequestFailed(true);
        });
    }, 500);
    setDebounceTimeout(newTimeout);
  }

  //On page load display posts returned from the empty string query GET request
  useEffect(() => {
    setDisplayLoadingSpinner(true);
    getPosts("")
      .then((res) => {
        setDisplayLoadingSpinner(false);
        setAxiosGetRequestFailed(false);
        console.log(res);
        setPosts(res.hits);
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
        <Header />
        <SearchBar value={searchString} onChange={handleChangeSearchString} />
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
      <Header />
      <SearchBar value={searchString} onChange={handleChangeSearchString} />

      {displayLoadingSpinner ? (
        <Box className="loading">
          <CircularProgress />
          <Typography variant="h5">Loading posts</Typography>
        </Box>
      ) : (
        <div id="posts">
          {posts.length === 0 ? (
            <h5>
              No posts found for the provided keyword. Search with a different
              keyword.
            </h5>
          ) : (
            posts.map((post) => (
              <CardPost
                title={post.title}
                key={post.objectID}
                url={post.url}
                objectID={post.objectID}
              />
            ))
          )}
        </div>
      )}

      <Footer />
    </>
  );
}

export default Home;
