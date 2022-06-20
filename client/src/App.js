import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.scss";
import UserContext from "./contexts/user/UserContext";
import AccessKeys from "./pages/AccessKeys";
import All from "./pages/conversations/All";
import Closed from "./pages/conversations/Closed";
import GetStarted from "./pages/conversations/GetStarted";
import Me from "./pages/conversations/Me";
import Prioritized from "./pages/conversations/Prioritized";
import Customers from "./pages/Customers";
import Integrations from "./pages/Integrations";
import { withAuthenticator, Button, Heading } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import UserContext from "./contexts/user/UserContext";
const SERVER = "http://127.0.0.1:3000";
import Organizations from "./pages/Organizations";

function App({ signOut, user }) {
  const [data, setData] = useState(null);
  const { loginUser } = useContext(UserContext);

  useEffect(() => {
    fetch(SERVER + "/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  useEffect(() => {
    console.log("userChanged", user);
  }, [user]);

  return (
    <Router>
        {/*<Sidebar signOut={signOut}/>*/}
        <Routes>
          <Route path="/" element={<Organizations />} />
          <Route
            path="/getstarted"
            element={<GetStarted signOut={signOut} />}
          />
          <Route
            path="/conversations/all"
            element={<All signOut={signOut} />}
          />
          <Route path="/conversations/me" element={<Me signOut={signOut} />} />
          <Route
            path="/conversations/prioritized"
            element={<Prioritized signOut={signOut} />}
          />
          <Route
            path="/conversations/closed"
            element={<Closed />}
            signOut={signOut}
          />
          <Route
            path="/integrations"
            element={<Integrations />}
            signOut={signOut}
          />
          <Route path="/customers" element={<Customers />} signOut={signOut} />
          <Route
            path="/accessKeys"
            element={<AccessKeys />}
            signOut={signOut}
          />
        </Routes>
    </Router>
  );
}

export default withAuthenticator(App);
