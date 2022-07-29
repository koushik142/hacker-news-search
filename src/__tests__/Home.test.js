import Home from "../components/Home";
import {
  act,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import axios from "axios";

const mock = new MockAdapter(axios);

const postsResponse = {
  hits: [
    {
      objectID: "16582136",
      title: "Stephen Hawking has died",
      url: "http://www.bbc.com/news/uk-43396008",
    },
    {
      objectID: "11116274",
      title: "A Message to Our Customers",
      url: "http://www.apple.com/customer-letter/",
    },
  ],
};

jest.useFakeTimers();

describe("Home Page", () => {
  const history = createMemoryHistory();

  const HomePageDOMTree = (history) => (
    <Router history={history}>
      <Home />
    </Router>
  );

  beforeEach(async () => {
    // https://github.com/clarkbw/jest-localstorage-mock/issues/125
    jest.clearAllMocks();

    mock
      .onGet("http://hn.algolia.com/api/v1/search?query=")
      .reply(200, postsResponse);

    render(HomePageDOMTree(history));

    await waitForElementToBeRemoved(() => screen.queryByText(/Loading posts/i));
  });

  it("should make a GET request to load posts", () => {
    const getPostsCall = mock.history.get.find(
      (req) => req.url === "http://hn.algolia.com/api/v1/search?query="
    );

    expect(getPostsCall).toBeTruthy();
  });

  it("shows posts on home page load", () => {
    for (let i = 0; i < 2; i++) {
      expect(screen.getByText(postsResponse.hits[i].title)).toBeInTheDocument();
      expect(screen.getByText(postsResponse.hits[i].url)).toBeInTheDocument();
    }
  });

  it("should display error message to the user if the GET request fails", async () => {
    mock.onGet("http://hn.algolia.com/api/v1/search?query=").reply(404, []);

    // https://github.com/clarkbw/jest-localstorage-mock/issues/125
    jest.clearAllMocks();

    render(HomePageDOMTree(history));

    await waitForElementToBeRemoved(() => screen.queryByText(/Loading posts/i));

    expect(
      screen.getByText(
        /Cannot fetch data at the moment. Try refreshing or open the app after some time./
      )
    ).toBeInTheDocument();
  });

  it("should show matching posts if found on search", async () => {
    const searchResponse = {
      hits: [
        {
          objectID: "31025061",
          title: "Elon Musk makes $43B unsolicited bid to take Twitter private",
          url: "https://www.bloomberg.com/news/articles/2022-04-14/elon-musk-launches-43-billion-hostile-takeover-of-twitter",
        },
        {
          objectID: "31153277",
          title: "Twitter set to accept Musk's $43B offer – sources",
          url: "https://www.reuters.com/technology/exclusive-twitter-set-accept-musks-best-final-offer-sources-2022-04-25/",
        },
      ],
    };

    mock
      .onGet("http://hn.algolia.com/api/v1/search?query=musk")
      .reply(200, searchResponse);

    const search = screen.getAllByPlaceholderText(/Start typing/i)[0];

    userEvent.type(search, "musk");

    await act(async () => {
      jest.runAllTimers();
    });

    for (let i = 0; i < 2; i++) {
      expect(
        screen.getByText(searchResponse.hits[i].title)
      ).toBeInTheDocument();
      expect(screen.getByText(searchResponse.hits[i].url)).toBeInTheDocument();
    }
  });
});
