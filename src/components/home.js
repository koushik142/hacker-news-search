import "./home.css";
import CardPost from "./cardPost";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Header from "./Header";
import SearchBar from "./SearchBar";

function Home() {
  const [posts, setPosts] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(0);
  const [displayLoadingSpinner, setDisplayLoadingSpinner] = useState(false);
  const [axiosGetRequestFailed, setAxiosGetRequestFailed] = useState(false);

  async function getPosts(query) {
    const response = await axios.get(
      "http://hn.algolia.com/api/v1/search?query=" + query
    );
    return response.data;
  }

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
              <CardPost title={post.title} key={post.objectID} url={post.url} objectID={post.objectID}/>
            ))
          )}
        </div>
      )}
    </>
  );
}

export default Home;
