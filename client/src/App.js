import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.scss";
import Sidebar from "./components/layout/Sidebar/Sidebar";
import All from "./pages/conversations/All";
import Closed from "./pages/conversations/Closed";
import GetStarted from "./pages/conversations/GetStarted";
import Me from "./pages/conversations/Me";
import Prioritized from "./pages/conversations/Prioritized";
import Customers from "./pages/Customers";
import Home from "./pages/Home";
import Integrations from "./pages/Integrations";

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <Router>
      <div className="wrapp">
        <Sidebar />
        <Routes>
          <Route path="/" element={<GetStarted />} />
          <Route path="/conversations/all" element={<All />} />
          <Route path="/conversations/me" element={<Me />} />
          <Route path="/conversations/prioritized" element={<Prioritized />} />
          <Route path="/conversations/closed" element={<Closed />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/customers" element={<Customers />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
