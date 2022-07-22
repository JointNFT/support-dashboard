import { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.scss";
import UserContext from "./contexts/user/UserContext";
import AccessKeys from "./pages/AccessKeys";
import GetStarted from "./pages/conversations/GetStarted";
import Customers from "./pages/Customers";
import Integrations from "./pages/Integrations";
import Organizations from "./pages/Organizations";
import Web3Context from "./contexts/web3/Web3Context";
import SignIn from "./components/SignIn";
import DiscordContact from "./pages/DiscordContact";
import Navbar from "./components/layout/Navbar/Navbar";
import WithSubnavigation from "./components/layout/Navbar/Navbar";
import All from "./pages/chat/All";
import Closed from "./pages/chat/Closed";
import Prioritized from "./pages/chat/Prioritized";
import Me from "./pages/chat/Me";


function App({ signOut, user }) {
    const [data, setData] = useState(null);
    const { loginUser } = useContext(UserContext);
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

    useEffect(() => {
        console.log("userChanged", user);
    }, [user]);

    return (
        <>
        { (address) ?  
          <>
            <Router>
              <WithSubnavigation />
            {/*<Sidebar signOut={signOut}/>*/}
            <Routes>
                <Route path="/" element={<Organizations />} />
                <Route path="/getstarted" element={<GetStarted signOut={signOut} />} />
                <Route path="/conversations/all" element={<All />} />
                <Route path="/conversations/me" element={<Me />} />
                <Route path="/conversations/prioritized" element={<Prioritized signOut={signOut} />} />
                <Route path="/conversations/closed" element={<Closed />} signOut={signOut} />
                <Route path="/integrations" element={<Integrations />} signOut={signOut} />
                <Route path="/customers" element={<Customers />} signOut={signOut} />
                <Route path="/accessKeys" element={<AccessKeys />} signOut={signOut} />
                <Route path="/discord" element={<DiscordContact />} signOut={signOut} />
            </Routes>
        </Router>
          </>
         : 
          <SignIn
            web3Loading={web3Loading}
            web3Provider={web3Provider}
            connectHandler={connectHandler}
            disconnectHandler={disconnectHandler}
            web3DisplayMessage={web3DisplayMessage}
          />
        }
      </>
        
    );
}

export default App;
