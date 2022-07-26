import "./App.css";
import Home from "./components/home";
import PostDetail from "./components/PostDetail";
import { Route, Switch } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/post/:id">
          <PostDetail />
        </Route>
        <Route path="/" exact>
          <Home />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
