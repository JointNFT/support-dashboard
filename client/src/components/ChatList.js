import {
  Box,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import ChatBox from "./ChatBox";
import { format } from "timeago.js";
import { useState } from "react";
import { getChannelList } from "../contexts/ChannelContext";

const ChatList = (props) => {
  const [isActive, setIsActive] = useState(null);
  const [list, setList] = useState([]);

  useEffect(() => {
    console.log(props)
    const list = getChannelList(props);
    console.log(list);
    setList(list);
  }, [props.channels]);

  const handleClick = (channelId, id) => {
    props.onSelectChannel(channelId);
    console.log("id", id);
    setIsActive(channelId);
    console.log("chh", channelId);
  };

  return (
    <Box
      width={{
        md: "25%",
        sm: "100%",
      }}
      height={"70vh"}
      mt="5"
    >
      <Heading as="h5" size="xs" color="#2C5282">
        Conversations / {props.heading}
      </Heading>
      <Heading as="h4" size={"md"} my="3" color="#2C5282">
        {props.heading}
      </Heading>
      <Tabs variant="unstyled" colorScheme="blue">
        <TabList mx={"auto"} justifyContent="center" gap="10px">
          {/* <Tab
            style={{ color: "#2C5282" }}
            bg={"#bee3f8"}
            width="60px"
            fontSize={"12px"}
          >
            Newest
          </Tab>
          <Tab
            style={{ color: "#2C5282" }}
            bg={"#bee3f8"}
            width="60px"
            fontSize={"12px"}
          >
            Oldest
          </Tab>
          <Tab
            style={{ color: "#2C5282" }}
            bg={"#bee3f8"}
            width="60px"
            fontSize={"12px"}
          >
            Longest
          </Tab>
          <Tab
            style={{ color: "#2C5282" }}
            bg={"#bee3f8"}
            width="60px"
            fontSize={"12px"}
          >
            Shortest
          </Tab> */}
        </TabList>
        <Box
          h={"70vh"}
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
