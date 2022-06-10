import React from "react";
import "./MessagePanel.css";
import { MessageList, ChatItem } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
const messageListReferance = React.createRef();

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

    handleKeypress = (e) => {
        //it triggers by pressing the enter key
        if (e.keyCode === 13) {
            this.send();
        }
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
                messageBodyParams.date = m.timestamp;
                return messageBodyParams;
            });
        }
        if (this.props.channel) {
            return (
                <div className="messages-panel">
                    { this.props.channel && <ChatItem
                        avatar={"https://storage.googleapis.com/opensea-static/opensea-profile/"+((parseInt(this.props.channel.userAddress)%30)+1)+".png"}
                        title={this.props.channel.userAddress}
                        date={this.props.channel.messages[this.props.channel.messages.length - 1].timestamp}
                        className="chat-head"
                    /> }
                    <MessageList
                        referance={messageListReferance}
                        className="message-list"
                        lockable={true}
                        style={this.style}
                        toBottomHeight={"100%"}
                        dataSource={list == [] ? [] : list}
                    />
                    {this.props.channel && (
                        <div className="messages-input">
                            <input type="text" onChange={this.handleInput} value={this.state.input_value} onKeyDown={this.handleKeypress} />
                            <button onClick={this.send}>Send</button>
                        </div>
                    )}
                </div>
            );
        }
        else {
            return <div className="messages-panel empty-panel"> Please select a chat to start ! </div>
        }
        
    }
}
