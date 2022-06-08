import React from "react";

export class CreateAccountForm extends React.Component {
    state = { userAddress: "", accessToken: "" };
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
            <div>
                <input type="text" id="userAdderss" onChange={this.handleUserAddressInput} value={this.state.userAddress}></input>
                <input type="text" id="accessToken" onChange={this.handleAccessTokenInput} value={this.state.accessToken}></input>
                <button onClick={this.createAccount}>Create Account</button>
            </div>
        );
    }
}
