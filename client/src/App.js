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

const SERVER = "http://127.0.0.1:3000";

function App({ signOut, user }) {
    const [data, setData] = useState(null);
    const { loginUser } = useContext(UserContext);
    const {web3DisplayMessage, web3Loading, address, web3Provider, connect, disconnect, provider, removeListeners } = useContext(Web3Context);
  
    const connectHandler = async (e) => {
      await connect();
    };
  
    const disconnectHandler = async (e) => {  
      disconnect();
    };
  
    useEffect(() => {
      if (provider?.on) {
        // Subscription Cleanup
        return () => {
          console.log('...');
          //remove the listeners here
        }
      }
    }, [provider, disconnect])

    useEffect(() => {
        fetch(SERVER + "/api")
            .then((res) => res.json())
            .then((data) => setData(data.message));
    }, []);

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
                <Route path="/getstarted" element={<GetStarted signOut={signOut} />} />
                <Route path="/conversations/all" element={<All signOut={signOut} />} />
                <Route path="/conversations/me" element={<Me signOut={signOut} />} />
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
