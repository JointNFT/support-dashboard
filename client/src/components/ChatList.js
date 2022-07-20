import {
  Box,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React from "react";
import ChatBox from "./ChatBox";
import { format } from "timeago.js";
import { useState } from "react";

const ChatList = (props) => {
  const handleClick = (channelId, id) => {
    props.onSelectChannel(channelId);
    console.log('id', id)
    setIsActive(channelId)
    console.log("chh", channelId);
  };

  const [isActive, setIsActive] = useState(null)

  console.log('props', props.type)

  let list = [];
  if (props.channels && props.channels.map) {
    list = props.channels
      .filter((c) => {
        if (props.type != null && props.type == (c.tag != null ? c.tag : ""))
          return true;
        else if (props.type == null || props.type == "all") return true;
        else if (props.type == "me" && props.address == c.assignedTo)
            return true;
        else return false;
      })
      .map((c) => {
        if (c.accessToken == props.accessToken) {
          return {
            avatar:
              "https://storage.googleapis.com/opensea-static/opensea-profile/" +
              ((parseInt(c.userAddress) % 30) + 1) +
              ".png",
            alt: "Some DP",
            title: c.userAddress,
            subtitle: c?.messages
              ? c?.messages[c.messages.length - 1]?.message
              : (c.lastMessage?.message || null),
            date: new Date(
              c?.messages
                ? c?.messages[c.messages.length - 1]?.timestamp
                : c?.lastMessage?.timestamp
            ),
            unread: c.unread != null ? c.unread : 0,
          };
        }
      });
  }

  if (list.length) {
    return (
      <Box width="25%" height={"70vh"} mt="5">
        <Heading as="h5" size="xs" color="#2C5282">
          Conversations / {props.heading}
        </Heading>
        <Heading as="h4" size={"md"} my="3" color="#2C5282">
          {props.heading} ({list.length})
        </Heading>
        <Tabs variant="unstyled" colorScheme="blue">
          <TabList mx={"auto"} justifyContent="center" gap="10px">
            <Tab
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
              isDisabled
            >
              Longest
            </Tab>
            <Tab 
              style={{ color: "#2C5282" }}
              bg={"#bee3f8"}
              width="60px"
              fontSize={"12px"}
              isDisabled
            >
              Shortest
            </Tab>
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
                {list.map((conversationInfo) => (
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
                ))}
              </TabPanel>
              <TabPanel>
                <p>two!</p>
              </TabPanel>
            </TabPanels>
          </Box>
        </Tabs>
      </Box>
    );
  } else {
    return (
      <div className="no-content-message">There is no channels to show</div>
    );
  }
};

export default ChatList;
