import React, { useContext } from "react";
import { isDesktop, isMobile } from "react-device-detect";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.scss";
import WithSubnavigation from "./components/layout/Navbar/Navbar";
import WagmiSignIn from "./components/WagmiSignIn";
import WagmiContext from "./contexts/wagmi/WagmiContext";
import AccessKeys from "./pages/AccessKeys";
import GetStarted from "./pages/conversations/GetStarted";
import Customers from "./pages/Customers";
import DiscordContact from "./pages/DiscordContact";
import Integrations from "./pages/Integrations";
import Organizations from "./pages/Organizations/Organizations";

//const SERVER = "http://127.0.0.1:3000";
const SERVER = "https://dashboard.highfi.me";

const ChatComponent = React.lazy(() =>
  isMobile
    ? import("./components/mobile/ChatList")
    : import("./pages/chat/Chat")
);

function App() {
  const {
    address,
    isConnected,
    connect,
    connectors,
    isLoading,
    pendingConnector,
    disconnect,
    error,
    signIn,
    signOut,
    signInLoading
  } = useContext(WagmiContext);

  const disconnectHandler = async () => {
   // disconnect();
   await signOut()
  };

   if (!isConnected || !address)
     return (
       <WagmiSignIn
         connectors={connectors}
         isLoading={isLoading}
         pendingConnector={pendingConnector}
         connect={connect}
         error={error}
         signIn={signIn}
         isConnected={isConnected}
      
       />
     );
  return (
    <>
    {process.env.REACT_APP_TITLE}
          <Router>
            {isDesktop && <WithSubnavigation />}
            {/*<Sidebar signOut={signOut}/>*/}
            <Routes>
              <Route path="/" element={<Organizations />} />
              <Route
                path="/getstarted"
                element={<GetStarted signOut={disconnectHandler} />}
              />
              {
                ["/conversations/all","/conversations"].map(p => (
                  <Route
                  key={p}
                  path={p}
                  element={
                    <React.Suspense fallback="Loading...">
                      <ChatComponent type="all" heading="All Conversations" />
                    </React.Suspense>
                  }
                />
                ))
              }
       
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
                path="/conversations/open"
                element={
                  <React.Suspense fallback="Loading...">
                    <ChatComponent type="open" heading="Open" />
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
  );
}

export default App;
