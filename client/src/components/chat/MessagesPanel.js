import React from "react";
import { MessageList, Input, Button } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
const messageListReferance = React.createRef();
const inputReferance = React.createRef();

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

    style = {
        width: "inherit",
        ".rce-container-mlist > width": "inherit",
    };

    render() {
        let list = [];
        if (this.props.channel && this.props.channel.messages) {
            list = this.props.channel.messages.map((m) => {
                let messageBodyParams = {};
                // left for incoming, right for outgoing
                messageBodyParams.position = m.from == "support" ? "right" : "left";
                messageBodyParams.type = "text";
                messageBodyParams.text = m.message;
                messageBodyParams.date = new Date();
                return messageBodyParams;
            });
            console.log("list", list);
            console.log("what comes out ? ", list ? list : []);
        }
        return (
            <div className="messages-panel">
                <MessageList
                    referance={messageListReferance}
                    className="message-list"
                    style={this.style}
                    dataSource={list == [] ? [] : list}
                />
                {this.props.channel && (
                        <Input
                            referance={inputReferance}
                            placeholder="Type here..."
                            multiline={true}
                            onChange={this.handleInput}
                            value={this.state.input_value}
                            rightButtons={<Button color="white" backgroundColor="blue" text="Send" onClick={this.send}/>}
                        />
                )}
            </div>
        );
    }
}
