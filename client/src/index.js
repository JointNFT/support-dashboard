import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Chat } from "./components/chat/Chat";
import Transaction from "./components/transaction/transaction";
import { Container, Row, Col, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Amplify, Auth } from "aws-amplify";
import awsExports from "./aws-exports";
import UserState from "./contexts/user/UserState";
Amplify.configure(awsExports);
Auth.configure(awsExports);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <UserState>
            <App />
        </UserState>
    </React.StrictMode>
    // document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
