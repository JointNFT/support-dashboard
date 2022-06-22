import { useEffect, useContext, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.scss";
import Sidebar from "./components/layout/Sidebar/Sidebar";
import All from "./pages/conversations/All";
import Closed from "./pages/conversations/Closed";
import GetStarted from "./pages/conversations/GetStarted";
import Me from "./pages/conversations/Me";
import Prioritized from "./pages/conversations/Prioritized";
import Customers from "./pages/Customers";
import AccessKeys from "./pages/AccessKeys";
import HeaderForm from "./pages/HeaderForm";
import Home from "./pages/Home";
import Integrations from "./pages/Integrations";
import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import UserContext from "./contexts/user/UserContext";

function App({ signOut, user }) {
  const [data, setData] = useState(null);
  const { loginUser } = useContext(UserContext);

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  useEffect(() => {
    console.log('userChanged', user)
  }, [user])


  return (
    <Router>
      <div className="wrapp">
        <Sidebar signOut={signOut}/>
        <Routes>
          <Route path="/" element={<GetStarted />} />
          <Route path="/conversations/all" element={<All />} />
          <Route path="/conversations/me" element={<Me />} />
          <Route path="/conversations/prioritized" element={<Prioritized />} />
          <Route path="/conversations/closed" element={<Closed />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/accessKeys" element={<AccessKeys />}/> 
          <Route path="/HeaderForm" element={<HeaderForm/>}/>
        </Routes>
      </div>
    </Router>
    
  );
}

export default withAuthenticator(App);
