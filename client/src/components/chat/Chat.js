import React, { Component } from "react";
import { Nav } from "react-bootstrap";
import { ChannelList } from "./ChannelList";
import "./chat.scss";
import { MessagesPanel } from "./MessagesPanel";
import socketClient, { io } from "socket.io-client";
import { useEffect, useContext, useState } from "react";
import UserContext from "../../contexts/user/UserContext";
const SERVER = "http://127.0.0.1:3000";

const Chat = (props) => {
    const { accessToken } = useContext(UserContext);
    const [channels, setChannels] = useState([]);
    let socket = null;
    const [channel, setChannel] = useState(null);
    const [loading, setLoading] = useState(null);

    loadChannels();
    configureSocket();

    function configureSocket() {
        if (socket) {
            return;
        }
        socket = io(SERVER);
        socket.on("connection", () => {
            setLoading(true);

            if (channel) {
                handleChannelSelect(channel.id);
            }
        });

        socket.on("test", (arg) => {
            console.log(arg);
        });

        socket.on("message", (message) => {
            console.log("message", message);
            let channelsCopy = channels;
            channelsCopy.forEach((c) => {
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
            setChannels(channelsCopy);
        });

        socket.on("new-account", (data) => {
            let channelsCopy = channels;
            let tempChannel = channelsCopy.find((c) => {
                return c.userAddress === data.userAddress;
            });
            if (tempChannel == null) {
                channels.push(channelsCopy);
                setChannels(channels);
            }
        });
    }

    async function loadChannels() {
        console.log("accessToken - ", accessToken);
        fetch(SERVER + "/getUsers?accessToken=" + accessToken).then(async (response) => {
            let data = await response.json();
            console.log("chaneel list", data);
            setChannels(data.users);
            console.log('channels list ='+ channels)
        });
    }

    function handleChannelSelect(address) {
        console.log(accessToken);
        let channelsCopy = channels;
        let channel = channelsCopy.find((c) => {
            return c.userAddress === address;
        });

        if (channel == undefined) {
            return;
        }

        fetch(SERVER + "/getMessages?address=" + address + "&accessToken=" + accessToken).then(async (response) => {
            let data = await response.json();
            channel.messages = data?.messages || "";
            channelsCopy.forEach((c) => {
                if (c.userAddress == channel.userAddress) {
                    c.unread = 0;
                }
            });
            setChannel(channel);
        });

        setChannels(channelsCopy);
        // this.socket.emit('create-account', {'address':'0xe96', accessToken: "some-token"});
    }

    function handleSendMessage (address, text)  {
        socket.emit("send-message", {
            id: Date.now(),
            address: address,
            accessToken: accessToken,
            message: text,
            to: address,
            from: "support",
            timestamp: +new Date(),
        });
    };

    return (
        <div className="chat-app">
            {/* {loading && (
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
            )} */}
            <ChannelList channels={channels} onSelectChannel={handleChannelSelect} type={props.type} accessToken={accessToken}/>
            <MessagesPanel onSendMessage={handleSendMessage} channel={channel} />
        </div>
    );
};

export default Chat;
