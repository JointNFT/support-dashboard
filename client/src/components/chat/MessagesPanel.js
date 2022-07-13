import {
  Avatar,
  ConversationHeader,
  InfoButton,
  Message,
  MessageList,
} from "@chatscope/chat-ui-kit-react";
import React, {useState} from "react";
import { AiOutlineStar } from "react-icons/ai";
import { BiTrashAlt } from "react-icons/bi";
import {
  RiDeleteBack2Fill,
  RiErrorWarningFill,
  RiCheckFill,
} from "react-icons/ri";
import { format } from "timeago.js";
import {Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import "./MessagePanel.scss";
const messageListReferance = React.createRef();

export class MessagesPanel extends React.Component {

  state = { input_value: "" ,
   };
  send = () => {
    if (this.state.input_value && this.state.input_value != "") {
      this.props.onSendMessage(
        this.props.channel.userAddress,
        this.state.input_value
      );
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
    let highlightPrioritized = {
      background: 'white'
    };
    let highlightCompleted = {
      background: 'white'
    };
    let highlightDeleted = {
      background: 'white'
    };

   const markPrioritized=()=>{
      document.getElementById('prioritized').style.backgroundColor = 'pink'
      document.getElementById('completed').style.backgroundColor = 'white'
      document.getElementById('deleted').style.backgroundColor = 'white'
      this.props.onTagClick("prioritized");
    };
    const markCompleted=()=>{
      document.getElementById('completed').style.backgroundColor = 'pink'
      document.getElementById('prioritized').style.backgroundColor = 'white'
      document.getElementById('deleted').style.backgroundColor = 'white'
      this.props.onTagClick("completed");
    };
    const deleteConversation=()=>{
      document.getElementById('deleted').style.backgroundColor = 'pink'
      document.getElementById('prioritized').style.backgroundColor = 'white'
      document.getElementById('completed').style.backgroundColor = 'white'
      this.props.onTagClick("deleted");
    };
    console.log(this.props.channel);

    const assignConversation = (address) =>{
      this.props.assignConversation(address);
    }

    if (this.props.channel && this.props.channel.tag) {
      var tag = this.props.channel.tag;
      if (tag === 'prioritized') {
        highlightPrioritized = {
          background: 'pink'
        }
      }
      if (tag === 'completed') {
        highlightCompleted = {
          background: 'pink'
        }
      }
      if (tag === 'deleted') {
        highlightDeleted = {
          background: 'pink'
        }
      }
    }
        
    let list = [];
    if (this.props.channel && this.props.channel.messages) {
      list = this.props.channel.messages.map((m) => {
        let messageBodyParams = {};
        // left for incoming, right for outgoing
        messageBodyParams.position =
          m.from == "support" ? "outgoing" : "incoming";
        messageBodyParams.type = "text";
        messageBodyParams.text = m.message;
        messageBodyParams.date = m.timestamp;
        messageBodyParams.from = m.from;
        messageBodyParams.to = m.to;
        return messageBodyParams;
      });
    }
    if (this.props.channel) {
      return (
        <div className="messages-panel" stlye={{ width: "100%" }}>
          {this.props.channel && (
            <ConversationHeader
              className="chat-head"
              style={{ zIndex: "999", width: "100%" }}
            >
              <Avatar
                src={
                  "https://storage.googleapis.com/opensea-static/opensea-profile/" +
                  ((parseInt(this.props.channel.userAddress) % 30) + 1) +
                  ".png"
                }
              />
              <ConversationHeader.Content
                style={{ userSelect: 'all' }}
                userName={this.props.channel.userAddress}
              />
              <ConversationHeader.Actions>
                <div>
                  <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                      Assign To
                    </MenuButton>
                    <MenuList>
                    {JSON.parse(this.props.organization.addresses).map((address) => (
                        <MenuItem onClick={() => assignConversation(address)}>{address}</MenuItem>
                    ))}
                    </MenuList>
                  </Menu>
                </div>
                <div className="icon">
                  <button className="prioritized" id="prioritized" style={highlightPrioritized} onClick={markPrioritized}><AiOutlineStar size={20}/></button>
                </div>
                <div className="icon">
                  <button className="completed" id="completed" style={highlightCompleted} onClick={markCompleted}><RiCheckFill size={20}  /></button>
                </div>
                <div className="icon">
                  <button className="deleted" id="deleted" style={highlightDeleted} onClick={deleteConversation}><BiTrashAlt size={20} /></button>
                </div>
              </ConversationHeader.Actions>
            </ConversationHeader>
          )}
          
          <MessageList className="message-list">
            {list.map((messageInfo) => (
              <Message
                model={{
                  message: messageInfo.text,
                  sentTime: format(messageInfo.date),
                  sender: messageInfo.from,
                  direction: messageInfo.position,
                  position: "single",
                }}
              >
                <Message.Header
                  sender={messageInfo.from}
                  sentTime={format(messageInfo.date)}
                />
                {messageInfo.position == "incoming" && (
                  <Avatar
                    src={
                      "https://storage.googleapis.com/opensea-static/opensea-profile/" +
                      ((parseInt(messageInfo.from) % 30) + 1) +
                      ".png"
                    }
                    name={messageInfo.from == "support" ? "" : messageInfo.from}
                  />
                )}
              </Message>
            ))}
          </MessageList>
          {this.props.channel && (
            <div className="messages-input">
              <input
                type="text"
                onChange={this.handleInput}
                value={this.state.input_value}
                onKeyDown={this.handleKeypress}
              />
              <button onClick={this.send}>Send</button>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div
          className="messages-panel empty-panel ms-auto"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div className="icon">
            <RiErrorWarningFill size={80} color={"#1890FF"} />
          </div>
          <h4>No messages</h4>
          <p>It looks like no channels have been set up yet!</p>
          <button
            style={{
              background: "#1890ff",
              fontSize: "14px",
              color: "#fff",
              padding: "5px 15px",
              border: "none",
              transition: ".4s ease all",
            }}
          >
            Get Started
          </button>
        </div>
      );
      
    }
  }
}
