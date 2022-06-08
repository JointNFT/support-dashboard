import React from "react";
import { Message } from "./Message";

export class MessagesPanel extends React.Component {
    state = { input_value: "" };
    send = () => {
        if (this.state.input_value && this.state.input_value != "") {
            this.props.onSendMessage(this.props.channel.userAddress, this.state.input_value);
            this.setState({ input_value: "" });
        }
    };

    handleInput = (e) => {
        this.setState({ input_value: e.target.value });
    };

    render() {
        let list = <div className="no-content-message">There is no messages to show</div>;
        if (this.props.channel && this.props.channel.messages) {
            list = this.props.channel.messages.map((m) => <Message address={m.from} message={m.message} />);
        }
        return (
            <div className="messages-panel">
                <div className="meesages-list">{list}</div>
                {this.props.channel && (
                    <div className="messages-input">
                        <input type="text" onChange={this.handleInput} value={this.state.input_value} />
                        <button onClick={this.send}>Send</button>
                    </div>
                )}
            </div>
        );
    }
}
