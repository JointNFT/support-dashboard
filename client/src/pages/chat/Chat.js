import { Box, Flex, useToast } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import ChatList from "../../components/ChatList";
import MessageList from "../../components/MessageList";
import Transaction from "../../components/Transaction";
import userContext from "../../contexts/user/UserContext";
import WagmiContext from "../../contexts/wagmi/WagmiContext";
import { SERVER } from "../../config";

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
};

const Chat = (props) => {
    const { accessToken, organization } = useContext(userContext);
    const { address } = useContext(WagmiContext);
    const [channels, setChannels] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState({});
    const [newAccount, setNewAccount] = useState({});
    const socket = useRef();
    const [channel, setChannel] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();


    useEffect(() => {
        loadChannels();
        configureSocket();
    }, []);
    async function loadChannels() {
        console.log("accessToken - ", accessToken);
        fetch(SERVER + "/chat/getUsers?accessToken=" + accessToken).then(async (response) => {
            let data = await response.json();
            setChannels(data.users);
        });
    }

    function configureSocket() {
        socket.current = io(SERVER, {
            type: "support",
            userAddress: address,
            accessToken: accessToken,
        });

        socket.current.emit("create-account", {
            type: "support",
            userAddress: address,
            accessToken: accessToken,
        });
        if (socket == null) {
            return;
        }

        socket.current.on("connection", () => {
            setLoading(false);
            console.log("connection happened");
            if (channel) {
                handleChannelSelect(channel.id);
            }
        });

        socket.current.on("test", (arg) => {
            console.log(arg);
        });

        socket.current.on("message", (message) => {
            console.log("message", message);
            console.log(channels);
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
        console.log('arrival message', arrivalMessage)
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
        const newChannel = channelCopy.find((c) => c.userAddress === channel.address);
        setChannel(newChannel);
    }, [arrivalMessage]);

/*     const handleUserTag = React.useCallback((tag) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const userAddress = channel?.userAddress;
        const accessToken = channel?.accessToken;
        const organizationId = organization?.organizationId;
        const createdBy = organization?.createdBy;
        const raw = JSON.stringify({
            userAddress,
            accessToken,
            createdBy,
            organizationId,
            tag: tag,
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        fetch("/conversations/updateUserTag", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result);
                if(result.status === 'success') {
                    toast({
                        title: 'Account created.',
                        description: "We've created your account for you.",
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                      });
                      loadChannels()
                }
            })
            .catch((error) => console.log("error", error));
    }, [channel, organization, loadChannels]); */

    // Handle tagging and assigning
    const handleMutate = (url, data, successMsg, callback) => {
        const userAddress = channel?.userAddress;
        const accessToken = channel?.accessToken;
        const organizationId = organization?.organizationId;
        const createdBy = organization?.createdBy;
        const raw = {
            userAddress,
            accessToken,
            createdBy,
            organizationId
        };
        console.log({...raw, ...data})
        fetch(url, {...requestOptions, body: JSON.stringify({...raw, ...data})})
        .then((response) => response.json())
        .then((result) => {
            if(result.status === 'success') {
                toast({
                    title: successMsg,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  });
                  loadChannels();
                  callback();
            }
        })
        .catch((error) => console.log("error", error));
    }
    const handleCloseConversation = React.useCallback(() => {
        const MSG = "The conversation has been closed successfully";
        const url = "/conversations/closeConversation";
        handleMutate(url, {}, MSG, () => setChannel({...channel, status: 'closed'}));
    }, [handleMutate, channel]);
    const handlePrioritizeConversation = React.useCallback(() => {
        const MSG  = 'The conversation has been marked as Priority';
        const url = "/conversations/updateUserTag";
        handleMutate(url, {tag: 'prioritized'}, MSG, () => setChannel({...channel, tag: 'prioritized'}) );
    }, [handleMutate, channel]);
    const assignConversation = useCallback((address) => {
        const MSG = `The conversation has been assigned to  ${address?.substring(0,7)}... successfully`;
        const url = "/conversations/assignConversation";
        handleMutate(url, { assignTo: address}, MSG, () =>  setChannel({...channel, assignedTo: address}))
    },[handleMutate, channel])

// Handle select conversation and send messages
    const handleChannelSelect = useCallback(
        (address) => {
            let channelsCopy = channels;

            let channel = channelsCopy.find((c) => {
                if (c.userAddress === address) {
                    console.log("jednako", address);
                }
                return c.userAddress == address;
            });

            if (channel == undefined) {
                return;
            }

            fetch(SERVER + "/chat/getMessages?address=" + address + "&accessToken=" + accessToken).then(async (response) => {
                let data = await response.json();
                channel.messages = data?.messages || "";
                channelsCopy.forEach((c) => {
                    if (c.userAddress == channel.userAddress) {
                        c.unread = 0;
                    }
                });
                setChannel(channel);
                setChannels(channelsCopy);
            });
    },[channels, accessToken]);

    const handleSendMessage =useCallback((address, text, attachment) => {
        const newMessage = {
            id: Date.now(),
            address: address,
            accessToken: accessToken,
            message: text,
            attachment,
            to: address,
            from: "support",
        };
        socket.current.emit("send-message", newMessage );
    }, [accessToken, socket]);

    return (
        <Box width={"100vw"} height="92vh" bg="#EBF8FF"> 
            <Flex justifyContent="center" height={"90vh"} width="90%" mx={"auto"} gap="30px">
                <ChatList
                    channels={channels}
                    onSelectChannel={handleChannelSelect}
                    type={props.type}
                    accessToken={accessToken}
                    heading={props.heading}
                />
                <MessageList
                    onSendMessage={handleSendMessage} 
                    channel={channel}
                    organization={organization}
                    assignConversation={assignConversation}
                    onCloseConversation={handleCloseConversation}
                    prioritizeConversation={handlePrioritizeConversation}
                />
                <Transaction userAddress={channel?.userAddress} />
            </Flex>
        </Box>
    );
};

export default Chat;
