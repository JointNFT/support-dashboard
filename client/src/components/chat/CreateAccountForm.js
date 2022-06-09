import React from "react";

export class CreateAccountForm extends React.Component {
    state = { userAddress: "", accessToken: "" };
    createAccount = () => {
        if (this.state.userAddress && this.state.input_value != "") {
            this.props.createAccount(this.state.userAddress, 'some-token');
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
                <div>
                    <input type="text" id="userAdderss" onChange={this.handleUserAddressInput} value={this.state.userAddress}></input>
                    <button onClick={this.createAccount}>Create Account</button>
                </div>
            </div>
        );
    }
}
