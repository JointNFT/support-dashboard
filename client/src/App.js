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
import Organizations from "./pages/Organizations";
import Web3Context from "./contexts/web3/Web3Context";
import SignIn from "./components/SignIn";
import DiscordContact from "./pages/DiscordContact";


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
            {/*<Sidebar signOut={signOut}/>*/}
            <Routes>
                <Route path="/" element={<Organizations />} />
                <Route path="/getstarted" element={<GetStarted signOut={disconnectHandler} />} />
                <Route path="/conversations/all" element={<All signOut={disconnectHandler} />} />
                <Route path="/conversations/me" element={<Me signOut={disconnectHandler} />} />
                <Route path="/conversations/prioritized" element={<Prioritized signOut={disconnectHandler} />} />
                <Route path="/conversations/closed" element={<Closed />} signOut={disconnectHandler} />
                <Route path="/integrations" element={<Integrations />} signOut={disconnectHandler} />
                <Route path="/customers" element={<Customers />} signOut={disconnectHandler} />
                <Route path="/accessKeys" element={<AccessKeys />} signOut={disconnectHandler} />
                <Route path="/discord" element={<DiscordContact />} signOut={disconnectHandler} />
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
