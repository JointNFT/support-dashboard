import {
  Box,
  Heading,
} from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import ChatBox from "./ChatBox";
import { format } from "timeago.js";
import { useState } from "react";
import { getChannelList } from "../contexts/ChannelContext";
import { TransactionStatusTab as ConversationStatusTab } from "./Transaction";
import{ WagmiContext }from '../contexts/wagmi'
const CONVERSATION_FILTER = {
  NEWEST: "Newest",
  OLDEST: "Oldest",
};
const CONVERSATION_TYPE = {
  ALL: 'all',
  PRIORITIZED: 'prioritized',
  CLOSED: 'closed',
  ME: 'me',
  OPEN: 'open'
}
const getTime = (date) =>{ 
  const d = new Date(date);
  if(isNaN(d)) return '';
  return Math.floor(d.getTime() / 1000)
};
const sortConversationsByTime = (conversations, filter) => {
  let result = conversations ? [...conversations] : [];
  switch (filter) {
    case CONVERSATION_FILTER.NEWEST:
      result = result.sort((a, b) => getTime(b.date) - getTime(a.date));
      break;
    case CONVERSATION_FILTER.OLDEST:
      result = result.sort((a, b) => getTime(a.date) - getTime(b.date));
      break;
    default:
      break;
  }
  return result;
};
const sortConversationsByType = (conversations, userAddress, type) => {
  let res = conversations ? [...conversations] : [];
  switch (type) {
    case CONVERSATION_TYPE.PRIORITIZED:
      res = res.filter(r => r?.tag ===  CONVERSATION_TYPE.PRIORITIZED);
      break;
    case CONVERSATION_TYPE.CLOSED:
      res = res.filter(r => r?.status === CONVERSATION_TYPE.CLOSED);
      break;
    case CONVERSATION_TYPE.OPEN:
      res = res.filter(r => r?.status !== CONVERSATION_TYPE.CLOSED);
    break;
    case CONVERSATION_TYPE.ME:
      console.log(userAddress)
      res = res.filter(r => r?.assignedTo === userAddress);
      break;
    default:
      break;
  }
  return res;
};
const ChatList = (props) => {
  const [isActive, setIsActive] = useState(null);
  const [list, setList] = useState([]);
  const [currentList, setCurrentList] = useState([]);
  const { address } = useContext(WagmiContext);
  const [filter, setFilter] = useState(CONVERSATION_FILTER.NEWEST);
  const handleFilterConversations = React.useCallback((value) => {
    setFilter(value);
  }, []);

  useEffect(() => {
    const list = getChannelList(props);
    console.log(list)
    const listByType = sortConversationsByType(list, address, props.type)
    setList(listByType);
  }, [props.channels, props.type, address]);

  useEffect(() => {
    setCurrentList(sortConversationsByTime(list, filter));
  }, [filter, list]);

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
        {props.heading}{' '}{list?.length ? `(${list.length})` : '' }
      </Heading>
        {Object.values(CONVERSATION_FILTER).map((k) => (
          <ConversationStatusTab
            key={k}
            title={k}
            active={filter === k}
            onClick={() => handleFilterConversations(k)}
          />
        ))}
        <Box
          h={"70vh"}
          marginTop="20px"
          sx={{
            "&::-webkit-scrollbar": {
              width: "6px",
              borderRadius: "8px",
              backgroundColor: `rgba(0, 0, 0, 0.05)`,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: `#90CDF4`,
              borderRadius: "2px",
            },
          }}
          overflowY={"scroll"}
          paddingRight="10px"
        >
          {currentList?.length ? (
            currentList.map((conversationInfo) => (
              <ChatBox
                isActive={isActive}
                setIsActive={setIsActive}
                src={conversationInfo.avatar}
                name={conversationInfo.title}
                info={conversationInfo.subtitle}
                unreadCnt={conversationInfo.unread}
                lastActivityTime={!isNaN(new Date(conversationInfo.date)) ? format(conversationInfo.date) : ''}
                handleClick={() => handleClick(conversationInfo.title)}
                id={conversationInfo.title}
                tag={conversationInfo?.tag}
                status={conversationInfo?.status}
                assignedTo={conversationInfo?.assignedTo}
              />
            ))
          ) : (
            <Heading as="h5" fontSize={"22px"} color="#2C5282" align={"center"}>
              No messages
            </Heading>
          )}
        </Box>
    </Box>
  );
};

export default ChatList;
