import React from "react";
import "./createAccountForm.css";
import { Button } from "react-chat-elements";

export class CreateAccountForm extends React.Component {
    queryParams = new URLSearchParams(window.location.search);
    state = { userAddress: "", accessToken: this.queryParams.get('accessToken') };
    createAccount = () => {
        if (this.state.userAddress && this.state.input_value != "") {
            this.props.createAccount(this.state.userAddress, this.state.accessToken);
        }
    };

    handleUserAddressInput = (e) => {
        this.setState({ userAddress: e.target.value });
    };

    handleAccessTokenInput = (e) => {
        this.setState({ accessToken: e.target.value });
    };

    render() {
        return (
            <div className="entry-page">
                <div>
                    <label>Please enter your wallet address to start talking !</label>
                    <input type="text" id="userAdderss" onChange={this.handleUserAddressInput} value={this.state.userAddress}></input>
                    <br/>
                    <Button onClick={this.createAccount} text="Start Chatting"></Button>
                </div>
            </div>
        );
    }
}
