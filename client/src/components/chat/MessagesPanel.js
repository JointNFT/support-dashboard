import React from "react";
import { MessageList, Input, Button } from "react-chat-elements";
// import FaPaperPlane from "react-icons/lib/fa/paper-plane";
import "react-chat-elements/dist/main.css";
const messageListReferance = React.createRef();
const inputReferance = React.createRef();

export class MessagesPanel extends React.Component {
  state = { input_value: "" };
  send = () => {
    if (this.state.input_value && this.state.input_value != "") {
      this.props.onSendMessage(
        this.props.channel.userAddress,
        this.state.input_value
      );
      this.setState({ input_value: "" });
      this.inputClear();
    }
  };

  inputClear = () => {};

  handleInput = (e) => {
    this.setState({ input_value: e.target.value });
  };

  style = {
    width: "inherit",
    ".rce-container-mlist > width": "inherit",
  };

  handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      this.send();
    }
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
        messageBodyParams.date = new Date(m.timestamp);
        return messageBodyParams;
      });
    }
    return (
      <div className="messages-panel">
        <div className="header">
          <h4 className="title">Welcome to HighFi Chat!</h4>
          <h6 className="subtitle">Ask us anything using the chat window 💭</h6>
          <div className="online-header">
            <h7>We are {this.props.isOnline} at the moment.</h7>
          </div>
        </div>
        <MessageList
          referance={messageListReferance}
          className="message-list"
          style={this.style}
          dataSource={list == [] ? [] : list}
        />
        {this.props.channel && (
          <Input
            className="messages-input"
            referance={inputReferance}
            color="black"
            placeholder="Start Typing..."
            multiline={true}
            clear={(clear) => (this.inputClear = clear)}
            onChange={this.handleInput}
            value={this.state.input_value}
            rightButtons={
              <button className="button" onClick={this.send}>
                {/* <FaPaperPlane color="white" /> */}
              </button>
            }
            onKeyDown={this.handleKeypress}
          />
        )}
      </div>
    );
  }
}
