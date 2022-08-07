import { Image, Box, Flex, Heading, Tag, Text, Badge } from "@chakra-ui/react";
import React from "react";
 export const TAG_TYPE = {
  PRIORITIZED: "prioritized",
  OPEN: "open",
  CLOSED: "closed",
};
export const TAG_COLOR = {
  [TAG_TYPE.PRIORITIZED]: "red.100",
  [TAG_TYPE.OPEN]: "yellow.100",
  [TAG_TYPE.CLOSED]: "gray.100",
};
export const ConversationTag = ({ type }) => {
  return (
    <Tag bg={TAG_COLOR[type]}>
      <span style={{ color: "#63171B", textTransform: "capitalize" }}>
        {type === TAG_TYPE.PRIORITIZED ? 'priority' : type}
      </span>
    </Tag>
  );
};
const ChatBox = ({
  id,
  isActive,
  name,
  info,
  lastActivityTime,
  src,
  handleClick,
  unreadCnt,
  status,
  tag,
  assignedTo
}) => {
  return (
    <Flex
      align="center"
      mb={"1"}
      width="100%"
      as={"a"}
      p="3"
      href="#"
      justifyContent="space-between"
      bg={isActive === id ? "white" : "transparent"}
      _active={{ background: "white" }}
      onClick={handleClick}
      boxShadow={isActive === id && "base"}
      borderRadius="6px"
    >
      <Flex align={"center"} justifyContent={"stretch"} maxWidth="80%">
        <Box>
          <Image
            boxSize="100%"
            width="40px"
            height="40px"
            objectFit="cover"
            borderRadius="6px"
            src={src}
            alt="Dan Abramov"
            fallbackSrc="../fallbackImg.png"
          />
        </Box>
        <Box
          flex={5}
          marginRight="5"
          marginLeft={3}
          alignItems="center"
          minWidth="0px"
        >
          <Heading as="h4" size={"sm"} noOfLines={1} color="blue.700">
            {name}
          </Heading>
          <Text noOfLines={1} fontSize="sm" color="gray.500">
            {info}
          </Text>
        </Box>
      </Flex>
      <Box ml="auto" textAlign="right">
        <Text noOfLines={1} fontSize="sm">
          {lastActivityTime}
        </Text>
        {tag ? (
          <ConversationTag type={tag} />
        ) : status === TAG_TYPE.CLOSED ? (
          <ConversationTag type={status} />
        ) : (
          <ConversationTag type={TAG_TYPE.OPEN} />
        )}
      </Box>
      {unreadCnt != 0 ?? (
        <Box flex={1} ml="auto">
          <Badge colorScheme="red">{unreadCnt}</Badge>
        </Box>
      )}
    </Flex>
    // );
  );
};

export default ChatBox;
