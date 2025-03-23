import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./views/Home";
import Profile from "./views/Profile";
import ExternalApi from "./views/ExternalApi";
import { useAuth0 } from "@auth0/auth0-react";
import history from "./utils/history";
// styles
import "./App.css";

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
import AdminAccess from "./views/AdminAccess";
initFontAwesome();

const App = () => {
  const { error} = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  return (
    <Router history={history}>
      <div id="app" className="d-flex flex-column h-100">
        <NavBar />
        <Container className="flex-grow-1 mt-5">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/external-api" component={ExternalApi} />
            <Route path="/check-permission" component={AdminAccess}/>
          </Switch>
        </Container>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
