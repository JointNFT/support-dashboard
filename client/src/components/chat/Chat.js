import React, { Component, useEffect, useContext, useState, useRef, useCallback } from "react";
import { Nav } from "react-bootstrap";
import { ChannelList } from "./ChannelList";
import "./chat.scss";
import { MessagesPanel } from "./MessagesPanel";
import { io } from "socket.io-client";
import UserContext from "../../contexts/user/UserContext";
import Web3Context from "../../contexts/web3/Web3Context";
import userContext from "../../contexts/user/UserContext";
const SERVER = "https://dashboard.highfi.me";

const Chat = (props) => {
    const { accessToken } = useContext(UserContext);
    const { organization } = useContext(userContext);
    const { address, setAddress } = useContext(Web3Context);
    const [channels, setChannels] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState({});
    const [newAccount, setNewAccount] = useState({});
    const socket = useRef();
    const [channel, setChannel] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(address, 'address changed');
        loadChannels();
        configureSocket();

    }, [address]);

    function configureSocket() {
        socket.current = io(SERVER, {
            type: "support",
            userAddress: address,
            accessToken: accessToken
        });

        socket.current.emit("create-account", {
            type: "support",
            userAddress: address,
            accessToken: accessToken
        });

        if (socket == null) {
            return;
        }

        socket.current.on("connection", () => {
            setLoading(false);

            if (channel) {
                handleChannelSelect(channel.id);
            }
        });

        socket.current.on("test", (arg) => {
            console.log(arg);
        });

        socket.current.on("message", (message) => {
            setArrivalMessage(message);
        });

        socket.current.on("new-account", (data) => {
            if (data.userAddress == "support") return;
            setNewAccount(data);
        });
    }

    useEffect(() => {
        if (newAccount != null && Object.keys(newAccount).length == 0) return;
        let newChannels = [...channels];
        let tempChannel = newChannels.find((c) => {
            return c.userAddress === newAccount.userAddress;
        });
        if (tempChannel == null) {
            newChannels.push(newAccount);
        }
        setChannels(newChannels);
    }, [newAccount]);

    useEffect(() => {
        if (arrivalMessage != null && Object.keys(arrivalMessage).length == 0) return;
        let channelCopy = [...channels];
        channelCopy.forEach((c) => {
            if (c.userAddress === arrivalMessage.address) {
                if (!c.messages) {
                    c.messages = [arrivalMessage];
                    c.unread = 1;
                } else {
                    c.messages.push(arrivalMessage);
                    c.unread = c.unread + 1;
                }
            }
        });
        setChannels(channelCopy);
        if (channel == null || !(address in channel)) return;
        const newChannel = channelCopy.find((c) => c.userAddress == channel.address);
        setChannel(newChannel);
    }, [arrivalMessage, channels]);

    function handleUserTag(tag) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var userAdderss = channel.userAddress;
        var accessToken = channel.accessToken;
        var raw = JSON.stringify({
            userAddress: userAdderss,
            accessToken: accessToken,
            tag: tag,
        });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        fetch("/updateUserTag", requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.log("error", error));
    }

    function assignConversation(address) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var userAdderss = channel.userAddress;
        var accessToken = channel.accessToken;
        var raw = JSON.stringify({
            userAddress: userAdderss,
            accessToken: accessToken,
            assignTo: address,
        });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        fetch("/assignConversation", requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.log("error", error));
    }

    async function loadChannels() {
        console.log("accessToken -- ", accessToken);
        fetch(SERVER + "/getUsers?accessToken=" + accessToken).then(async (response) => {
            let data = await response.json();
            setChannels(data.users);
        });
    }
 
    const handleChannelSelect = useCallback((address) => {
        let channelsCopy = channels;
        
        let channel = channelsCopy.find((c) => {
            return c.userAddress === address;
        });
        
        console.log("first handle channel select", channels);
        setChannel(channel)
        console.log('CHANNEL', channel)
        
        if (channel === undefined) {
            return;
        }
        

        fetch(SERVER + "/getMessages?address=" + address + "&accessToken=" + accessToken).then(async (response) => {
            let data = await response.json();
            channel.messages = data?.messages || "";
            channelsCopy.forEach((c) => {
                if (c.userAddress === channel.userAddress) {
                    c.unread = 0;
                }
            });
            setChannel(channel);
            setChannels(channelsCopy);
        });
    }, [channels])
  
    function handleSendMessage(address, text) {
        socket.current.emit("send-message", {
            id: Date.now(),
            address: address,
            accessToken: accessToken,
            message: text,
            to: address,
            from: "support",
            timestamp: +new Date(),
        });
    }


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
            <ChannelList channels={channels} onSelectChannel={handleChannelSelect} type={props.type} accessToken={accessToken} address = {address}/>
            <MessagesPanel onSendMessage={handleSendMessage} onTagClick={handleUserTag} channel={channel} organization={organization} assignConversation={assignConversation}/>
        </div>
    );
};

export default Chat;
