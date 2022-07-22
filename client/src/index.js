import { ChakraProvider } from '@chakra-ui/react';
import ReactDOM from "react-dom/client";
import App from "./App";
import UserState from "./contexts/user/UserState";
import Web3State from "./contexts/web3/Web3State";



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <ChakraProvider>
        <Web3State>
            <UserState>
                <App />
            </UserState>
        </Web3State>
    </ChakraProvider>
);

