import React from "react";
import { Nav } from "react-bootstrap";
import { ChannelList } from "./ChannelList";
import "./chat.scss";
import { MessagesPanel } from "./MessagesPanel";
import socketClient, { io } from "socket.io-client";
const SERVER = "http://127.0.0.1:3000";

export class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.queryParams = new URLSearchParams(window.location.search);

        this.state = {
            channels: null,
            socket: null,
            channel: null,
            accessToken: this.queryParams.get("accessToken"),
            loading: false,
            connectedCount: 0,
        };
        this.socket = null;
    }
    componentDidMount() {
        this.loadChannels();
        this.configureSocket();
    }

    configureSocket = () => {
        if (this.socket) {
            return;
        }
        this.socket = io(SERVER);
        this.socket.on("connection", () => {
            if (this.state.connectedCount < 1) {
                this.setState((prev) => ({ ...prev, loading: true }));
            } else {
                this.setState((prev) => ({ ...prev, loading: false }));
            }

            this.setState((prev) => ({
                ...prev,
                connectedCount: prev.connectedCount + 1,
            }));

            this.socket.emit("create-account", {
                userAddress: "support",
                accessToken: this.state.accessToken,
            });

            if (this.state.channel) {
                this.handleChannelSelect(this.state.channel.id);
            }
        });
        this.socket.on("test", (arg) => {
            console.log(arg);
        });

        this.socket.on("message", (message) => {
            console.log("message", message);
            let channels = this.state.channels;
            channels.forEach((c) => {
                if (c.userAddress === message.address) {
                    if (!c.messages) {
                        c.messages = [message];
                        c.unread = 1;
                    } else {
                        c.messages.push(message);
                        c.unread = c.unread + 1;
                    }
                }
            });
            this.setState({ channels });
        });

        this.socket.on("new-account", (data) => {
            let channels = this.state.channels;
            let channel = channels.find((c) => {
                return c.userAddress === data.userAddress;
            });
            if (channel == null) {
                channels.push(data);
                this.setState({ channels });
            }
        });
    };

    loadChannels = async () => {
        console.log("accessToken - ", this.state.accessToken);
        fetch(SERVER + "/getUsers?accessToken=" + this.state.accessToken).then(async (response) => {
            let data = await response.json();
            console.log("chaneel list", data);
            this.setState({ channels: data.users });
        });
    };

    handleChannelSelect = (address) => {
        let channels = this.state.channels;
        let channel = channels.find((c) => {
            return c.userAddress === address;
        });

        if (channel == undefined) {
            return;
        }
        fetch(SERVER + "/getMessages?address=" + address + "&accessToken=" + this.state.accessToken).then(async (response) => {
            let data = await response.json();
            channel.messages = data?.messages || "";
            channels.forEach((c) => {
                if (c.userAddress == channel.userAddress) {
                    c.unread = 0;
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
            to: address,
            from: "support",
            timestamp: +new Date(),
        });
        console.log({ socket: this.socket.id });
    };

    render() {
        console.log(this.props);
        return (
            <div className="chat-app">
                {this.state.loading && (
                    <div
                        style={{
                            position: "absolute",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "white",
                            left: "0",
                            top: "0",
                            zIndex: "100",
                            width: "100vw",
                            height: "100vh",
                            backgroundColor: "rgba(0, 0, 0, .8)",
                        }}
                    >
                        Socket Connecting...
                    </div>
                )}
                <ChannelList channels={this.state.channels} onSelectChannel={this.handleChannelSelect} type={this.props.type} />
                <MessagesPanel onSendMessage={this.handleSendMessage} channel={this.state.channel} />
            </div>
        );
    }
}
