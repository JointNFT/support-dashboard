import {
  Box,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useEffect } from "react";
import { format } from "timeago.js";
import { getChannelList } from "../../contexts/ChannelContext";
import ChatBox from "../ChatBox";
import Nav from "./Nav";

const ChatList = (props) => {
  const handleClick = (channelId, id) => {
    props.onSelectChannel(channelId);
    console.log("id", id);
    setIsActive(channelId);
    console.log("chh", channelId);
  };

  const [list, setList] = useState([]);

  const [isActive, setIsActive] = useState(null);

  console.log("props", props.type);

  useEffect(() => {
    const list = getChannelList(props);
    setList(list)
  }, [])

  

  return (
    <Box
      flex={"100%"}
      bg="blue.100"
      height={"100vh"}
      width={{ sm: "100%", md: "100%" }}
    >
      <Nav type={props.type} heading={props.heading} />
      <Tabs colorScheme="pink" p="2">
        <TabList>
          <Tab style={{ color: "#fff" }}>Tab 1</Tab>
          <Tab style={{ color: "#fff" }}>Tab 2</Tab>
          <Tab style={{ color: "#fff" }}>Tab 3</Tab>
          <Tab style={{ color: "#fff" }}>Tab 4</Tab>
        </TabList>
        <Box
          h={"80vh"}
          marginTop="20px"
          sx={{
            "&::-webkit-scrollbar": {
              width: "10px",
              borderRadius: "8px",
              backgroundColor: `rgba(0, 0, 0, 0.05)`,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: `rgba(255, 255, 255, 1)`,
            },
          }}
          overflowY={"scroll"}
        >
          <TabPanels>
            <TabPanel>
              {list?.length ? (
                list.map((conversationInfo) => (
                  <ChatBox
                    isActive={isActive}
                    setIsActive={setIsActive}
                    src={conversationInfo.avatar}
                    name={conversationInfo.title.slice(0, 10) + "..."}
                    info={conversationInfo.subtitle}
                    unreadCnt={conversationInfo.unread}
                    lastActivityTime={format(conversationInfo.date)}
                    handleClick={() => handleClick(conversationInfo.title)}
                    id={conversationInfo.title}
                  />
                ))
              ) : (
                <Heading
                  as="h5"
                  fontSize={"22px"}
                  color="#2C5282"
                  align={"center"}
                >
                  No messages
                </Heading>
              )}
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
          </TabPanels>
        </Box>
      </Tabs>
    </Box>
  );
};

export default ChatList;
