import React, { useContext, useEffect, useState } from "react";
import { isDesktop, isMobile } from "react-device-detect";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.scss";
import WithSubnavigation from "./components/layout/Navbar/Navbar";
import SignIn from "./components/SignIn";
import UserContext from "./contexts/user/UserContext";
import Web3Context from "./contexts/web3/Web3Context";
import AccessKeys from "./pages/AccessKeys";
import GetStarted from "./pages/conversations/GetStarted";
import Customers from "./pages/Customers";
import DiscordContact from "./pages/DiscordContact";
import Integrations from "./pages/Integrations";
import Organizations from "./pages/Organizations/Organizations";

//const SERVER = "http://127.0.0.1:3000";
const SERVER = "http://localhost:3001";

const ChatComponent = React.lazy(() =>
  isMobile
    ? import("./components/mobile/ChatList")
    : import("./pages/chat/Chat")
);

function App() {
    const {web3DisplayMessage, web3Loading, address, web3Provider, connect, handleDisconnect, provider, removeListeners } = useContext(Web3Context);
  
    const connectHandler = async (e) => {
      await connect();
    };
  
    const disconnectHandler = async (e) => {  
        handleDisconnect();
    };
  
    useEffect(() => {
      if (provider?.on) {
        // Subscription Cleanup
        return () => {
          console.log('...');
          //remove the listeners here
        }
      }
    }, [provider, handleDisconnect])


  return (
    <>
      {address ? (
        <>
          <Router>
            {isDesktop && <WithSubnavigation />}
            {/*<Sidebar signOut={signOut}/>*/}
            <Routes>
              <Route path="/" element={<Organizations />} />
              <Route
                path="/getstarted"
                element={<GetStarted signOut={disconnectHandler} />}
              />
              <Route
                path="/conversations/all"
                element={
                  <React.Suspense fallback="Loading...">
                    <ChatComponent type="all" heading="All Conversations" />
                  </React.Suspense>
                }
              />
              <Route
                path="/conversations/me"
                element={
                  <React.Suspense fallback="Loading...">
                    <ChatComponent type="me" heading="Assigned to me" />
                  </React.Suspense>
                }
              />
              <Route
                path="/conversations/prioritized"
                element={
                  <React.Suspense fallback="Loading...">
                    <ChatComponent type="prioritized" heading="Prioritized" />
                  </React.Suspense>
                }
              />
              <Route
                path="/conversations/closed"
                element={
                  <React.Suspense fallback="Loading...">
                    <ChatComponent type="closed" heading="Closed" />
                  </React.Suspense>
                }
              />
              <Route
                path="/integrations"
                element={<Integrations signOut={disconnectHandler} />}
              />
              <Route
                path="/customers"
                element={<Customers signOut={disconnectHandler} />}
              />
              <Route
                path="/accessKeys"
                element={<AccessKeys signOut={disconnectHandler} />}
              />
              <Route
                path="/discord"
                element={<DiscordContact signOut={disconnectHandler} />}
              />
            </Routes>
          </Router>
        </>
      ) : (
        <SignIn
          web3Loading={web3Loading}
          web3Provider={web3Provider}
          connectHandler={connectHandler}
          disconnectHandler={disconnectHandler}
          web3DisplayMessage={web3DisplayMessage}
        />
      )}
    </>
  );
}

export default App;
