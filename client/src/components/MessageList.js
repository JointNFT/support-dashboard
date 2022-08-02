import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  Stack,
  Tag,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from "@chakra-ui/react";
import { ChevronDownIcon } from '@chakra-ui/icons';
import React, { useState } from "react";
import { useEffect } from "react";
import { RiErrorWarningFill } from "react-icons/ri";
import { format } from "timeago.js";
import MessageBar from "./Message/MessageBar";
import MessageBox from "./Message/MessageBox";
import Reciever from "./Message/Reciever";
import Sender from "./Message/Sender";
import MessageHeader from "./MessageHeader";

const MessageList = (props) => {
  const [input, setInput] = useState("");

  const send = () => {
    if (input && input != "") {
      props.onSendMessage(props.channel.userAddress, input);
      console.log(props.channel)
      setInput("");
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      send();
    }
  };
  const assignConversation = (address) =>{
    props.assignConversation(address);
  };
  const onCloseConversation = () =>{
    props.onCloseConversation();
  };
  const prioritizeConversation = () =>{
    props.prioritizeConversation();
  };

  const getStatus = () => {
    if (props.channel != null) {
      var isClosed = props.channel.status === 'closed' ?  'closed' :  'open'
      return isClosed;
    }
  };
  const isPrioritized = () => {
    var isPrioritized = false
    if (props.channel != null) {
      isPrioritized = props.channel.tag === 'prioritized' ?  'priority' :  false
    }
    return isPrioritized;
  };

  const style = {
    width: "inherit",
    ".rce-container-mlist > width": "inherit",
  };

  const markPrioritized = () => {
    var property = document.getElementById("button1");
    property.style.backgroundColor = "pink";
    props.onTagClick("prioritized");
  };
  const markCompleted = () => {
    var property = document.getElementById("button1");
    property.style.backgroundColor = "pink";
    props.onTagClick("completed");
  };
  const deleteConversation = () => {
    var property = document.getElementById("button1");
    property.style.backgroundColor = "pink";
    props.onTagClick("deleted");
  };


  let list = [];
  if (props.channel && props.channel.messages) {
    list = props.channel.messages.map((m) => {
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

  if (props.channel) {
    return (
      <Box height={"70vh"} width="40%" mt="5">
        <Flex bg="white" borderRadius={"5px"} py="3">
          <Box width="98%" mx="auto" marginLeft="2">
            <Tag bg="pink.100" mr="2">
            {isPrioritized()}
            </Tag>
            <Tag bg="yellow.100">{getStatus()}</Tag>
          </Box>
          <Flex
            width="100%"
            alignItems={"center"}
            justifyContent="right"
            gap={"10px"}
            marginRight="2"
          >
            
            <div>
                  <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                      Assign To
                    </MenuButton>
                    <MenuList>
                    {JSON.parse(props.organization.addresses).map((address) => (
                        <MenuItem onClick={() => assignConversation(address)}>{address}</MenuItem>
                    ))}
                    </MenuList>
                  </Menu>
                </div>
            <IconButton colorScheme="teal" aria-label="Call Segun" size="xs" />
            <Heading as="h6" size="sm">
              @Adam
            </Heading>
          </Flex>
        </Flex>
        <MessageHeader
          src={
            "https://storage.googleapis.com/opensea-static/opensea-profile/" +
            ((parseInt(props.channel.userAddress) % 30) + 1) +
            ".png"
          }
          userName={props.channel.userAddress}
          lastMessage = {props.channel.lastMessage}
          onCloseConversation={onCloseConversation}
          prioritizeConversation={prioritizeConversation}
        />
        <MessageBox channel={props.channel} list={list} />

        <MessageBar
          handleInput={handleInput}
          input={input}
          handleKeypress={handleKeypress}
          send={send}
        />
      </Box>
    );
  } else {
    return (
      <Box height={"70vh"} width="40%" mt="5" textAlign={'center'} display='flex' flexDir={'column'} gap='20px'> 
        <div className="icon">
          <RiErrorWarningFill size={80} color={"#1890FF"} />
        </div>
        <h4>No messages</h4>
        <p>It looks like no channels have been set up yet!</p>
        <button
          style={{
            width:'50%',
            margin:'0 auto',
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
      </Box>
    );
  }
};

export default MessageList;
