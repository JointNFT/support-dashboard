import React from "react";
import { Nav } from "react-bootstrap";
import { ChannelList } from "./ChannelList";
import "./chat.scss";
import { MessagesPanel } from "./MessagesPanel";
import socketClient from "socket.io-client";
const SERVER = "http://127.0.0.1:3000";
export class Chat extends React.Component {
    queryParams = new URLSearchParams(window.location.search);

    state = {
        channels: null,
        socket: null,
        channel: null,
        accessToken: this.queryParams.get('accessToken')
    };
    socket;
    componentDidMount() {
        this.loadChannels();
        this.configureSocket();
    }

    configureSocket = () => {
        var socket = socketClient();
        socket.on("connection", () => {
            if (this.state.channel) {
                this.handleChannelSelect(this.state.channel.id);
            }
        });

        socket.on("message", (message) => {
            console.log("message", message);
            let channels = this.state.channels;
            channels.forEach((c) => {
                if (c.userAddress === message.address) {
                    if (!c.messages) {
                        c.messages = [message];
                        c.unread = 1
                    } else {
                        c.messages.push(message);
                        c.unread = c.unread + 1
                    }
                }
            });
            this.setState({ channels });
        });

        socket.on("new-account", (data) => {
            let channels = this.state.channels;
            channels.push(data);
            this.setState({ channels });
        });

        this.socket = socket;
    };

    loadChannels = async () => {
        console.log('accessToken - ', this.state.accessToken);
        fetch("/getUsers?accessToken="+this.state.accessToken).then(async (response) => {
            let data = await response.json();
            this.setState({ channels: data.users });
        });
    };

    handleChannelSelect = (address) => {
        let channels = this.state.channels;
        let channel = channels.find((c) => {
            return c.userAddress === address;
        });
        
        fetch("/getMessages?address=" + address + "&accessToken="+this.state.accessToken).then(async (response) => {
            let data = await response.json();
            channel.messages = data.messages;
            channels.forEach((c) => {
                if (c.userAddress === channel.userAddress) {
                        c.unread = 0
                }
            });
            this.setState({ channel });
        });
        
        this.setState({ channels });
        // this.socket.emit('create-account', {'address':'0xe96', accessToken: "some-token"});
    };

    handleSendMessage = (address, text) => {
        this.socket.emit("send-message", {
            id: Date.now(),
            address: address,
            accessToken: this.state.accessToken,
            message: text,
            to: "0xe97",
            from: "support",
        });
    };

    render() {
        return (
            <div className="chat-app">
                <ChannelList channels={this.state.channels} onSelectChannel={this.handleChannelSelect} />
                <MessagesPanel onSendMessage={this.handleSendMessage} channel={this.state.channel} />
            </div>
        );
    }
}
