import React from "react";
import { ChannelList } from "./ChannelList";
import { CreateAccountForm } from "./CreateAccountForm";
import "./chat.scss";
import { MessagesPanel } from "./MessagesPanel";
import socketClient from "socket.io-client";
// const SERVER = "https://support-dashboard-highfy.herokuapp.com";
const SERVER = "http://localhost:3000";

export class Chat extends React.Component {
  queryParams = new URLSearchParams(window.location.search);

  state = {
    channels: null,
    socket: null,
    channel: null,
    isLoggedIn: false,
    address: "",
    isOnline: "offline",
    accessToken: this.queryParams.get("accessToken"),
  };
  socket;
  componentDidMount() {
    this.loadChannels();
    this.configureSocket();
  }

  configureSocket = () => {
    console.log("address", this.state.address);
    var socket = socketClient(SERVER);

    socket.emit("test", "isOnline"); //testing if support-dashboard is online
    socket.on("response", (arg) => {
      //response from the support-dashboard if online
      this.setState({ isOnline: "online" });
    });

    socket.on("connection", () => {
      if (this.state.channel) {
        this.handleChannelSelect(this.state.channel.id);
      }
    });

    console.log(11);
    socket.on("message", (message) => {
      console.log("message", message);
      let channels = this.state.channels;
      channels.forEach((c) => {
        if (c.userAddress === message.address) {
          if (!c.messages) {
            c.messages = [message];
          } else {
            c.messages.push(message);
          }
        }
      });
      this.setState({ channels });
    });

    socket.on("new-account", (data) => {
      if (data.userAddress == null || data.userAddress == "") {
        return;
      }
      this.setState({ address: data.userAddress, isLoggedIn: true });
      this.handleChannelSelect(data.userAddress);
    });

    this.socket = socket;
  };

  loadChannels = async () => {
    let channels = [{ userAddress: "", accessToken: this.state.accessToken }];
    this.setState({ channels });
  };

  handleChannelSelect = (address) => {
    let channel = this.state.channels.find((c) => {
      return c.userAddress === address;
    });

    fetch(
      SERVER +
        "/getMessages?address=" +
        address +
        "&accessToken=" +
        this.state.accessToken
    ).then(async (response) => {
      let data = await response.json();
      channel.messages = data.messages;
      this.setState({ channel });
    });
    // this.socket.emit('create-account', {'address':'0xe96', accessToken: "some-token"});
  };

  handleSendMessage = (address, text) => {
    this.socket.emit("send-message", {
      id: Date.now(),
      address: address,
      accessToken: this.state.accessToken,
      message: text,
      to: "support",
      from: address,
      timestamp: +new Date(),
    });
  };

  handleCreateAccount = (address, accessToken) => {
    this.socket.emit("create-account", { userAddress: address, accessToken });
    let channels = this.state.channels;
    channels[0].userAddress = address;
    this.setState({ channels });
  };

  render() {
    return (
      <div>
        {this.state.isLoggedIn ? (
          <div className="chat-app">
            <MessagesPanel
              onSendMessage={this.handleSendMessage}
              channel={this.state.channel}
              address={this.state.address}
              isOnline={this.state.isOnline}
            />
          </div>
        ) : (
          <CreateAccountForm createAccount={this.handleCreateAccount} />
        )}
      </div>
    );
  }
}
