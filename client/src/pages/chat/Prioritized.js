import { Box, Flex } from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useCallback } from "react";
import { io } from "socket.io-client";
import ChatList from "../../components/ChatList";
import MessageList from "../../components/MessageList";
import Tranasaction from "../../components/Tranasaction";
import UserContext from "../../contexts/user/UserContext";
const SERVER = "https://dashboard.highfi.me";

function Prioritized(props) {
  const { accessToken } = useContext(UserContext);
  const [channels, setChannels] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState({});
  const [newAccount, setNewAccount] = useState({});
  const socket = useRef();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChannels();
    configureSocket();
  }, []);

  function configureSocket() {
    socket.current = io(SERVER, {
      userAdderss: "support",
      accessToken: accessToken,
    });
    socket.current.emit("create-account", {
      userAddress: "support",
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
    if (arrivalMessage != null && Object.keys(arrivalMessage).length == 0)
      return;
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
    const newChannel = channelCopy.find(
      (c) => c.userAddress === arrivalMessage.userAddress
    );

    console.log('arrival')
    setChannel(newChannel);
  }, [arrivalMessage]);

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

  async function loadChannels() {
    console.log("accessToken - ", accessToken);
    fetch(SERVER + "/getUsers?accessToken=" + accessToken).then(
      async (response) => {
        let data = await response.json();
        console.log("channel list", data);
        setChannels(data.users);
        console.log("channels list =" + channels);
      }
    );
  }

  const handleChannelSelect = useCallback((address) => {
    let channelsCopy = channels;
    console.log("first handle channel select", channels);

    let channel = channelsCopy.find((c) => {
      console.log(address)
      if(c.userAddress === address) {
        console.log('jednako', address)
      }
      return c.userAddress == address;
    });

    if (channel == undefined) {
      return;
    }

    fetch(
      SERVER + "/getMessages?address=" + address + "&accessToken=" + accessToken
    ).then(async (response) => {
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
    <Box width={"100vw"} height="92vh" bg="#EBF8FF">
      <Flex
        justifyContent="center"
        height={"90vh"}
        width="90%"
        mx={"auto"}
        gap="30px"
      >
        <ChatList
          channels={channels}
          onSelectChannel={handleChannelSelect}
          type={"prioritized"}
          accessToken={accessToken}
          heading="Prioritized"
        />
        <MessageList
          onSendMessage={handleSendMessage}
          onTagClick={handleUserTag}
          channel={channel}
        />
        <Tranasaction />
      </Flex>
    </Box>
  );
}

export default Prioritized;
