import "./home.css";
import CardPost from "./cardPost";
import React, { useState } from "react";
import axios from "axios";

function Home() {
  const [posts, setPosts] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(0);

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
      getPosts(userInput)
        .then((res) => {
          console.log(res);
          setPosts(res.hits);
        })
        .catch((err) => {
          console.log(err.message);
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
      <div id="posts">
        {posts.map((post) => (
          <CardPost title={post.title} key={post.objectID} url={post.url} />
        ))}
      </div>
    </>
  );
}

export default Home;
