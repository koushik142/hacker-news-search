import "./home.css";
import CardPost from "./cardPost";
import React, { useState } from "react";
import axios from "axios";
import { CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";

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
          console.log(res);
          setPosts(res.hits);
        })
        .catch((err) => {
          console.log(err.message);
          setDisplayLoadingSpinner(false);
        });
    }, 500);
    setDebounceTimeout(newTimeout);
  }

  return (
    <>
      <header>
        <h1>Hacker News Search</h1>
      </header>

      <div id="search-bar">
        <input
          type="text"
          placeholder="Start typing ..."
          value={searchString}
          onChange={handleChangeSearchString}
        ></input>
      </div>

      {displayLoadingSpinner ? (
        <Box className="loading">
          <CircularProgress />
          <Typography variant="h5">Loading posts</Typography>
        </Box>
      ) : (
        <div id="posts">
          {posts.map((post) => (
            <CardPost title={post.title} key={post.objectID} url={post.url} />
          ))}
        </div>
      )}
    </>
  );
}

export default Home;
