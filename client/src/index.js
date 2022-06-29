import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import UserState from "./contexts/user/UserState";
import Web3State from "./contexts/web3/Web3State";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from '@chakra-ui/react'



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <ChakraProvider>
        <Web3State>
            <UserState>
                <App />
            </UserState>
        </Web3State>
        </ChakraProvider>
    </React.StrictMode>
    // document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
