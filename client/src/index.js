import { ChakraProvider } from '@chakra-ui/react';
import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import UserState from "./contexts/user/UserState";
import Web3State from "./contexts/web3/Web3State";
import { WagmiProvider, client } from './contexts/wagmi';
import {
    WagmiConfig
  } from 'wagmi'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
        <ChakraProvider>
             <WagmiConfig client={client}>
                <WagmiProvider>
                    <UserState>
                        <App />
                    </UserState>
                </WagmiProvider>
            </WagmiConfig>
        </ChakraProvider>
);

