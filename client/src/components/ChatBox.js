import { Image, Box, Flex, Heading, Tag, Text, Badge } from "@chakra-ui/react";
import React from "react";

const ChatBox = ({ id, isActive, name, info, lastActivityTime, src, handleClick, unreadCnt }) => {
    return (
        <Flex
            align="center"
            mb={"1"}
            width="100%"
            as={"a"}
            p="2"
            href="#"
            bg={isActive === id ? "white" : "transparent"}
            _active={{ background: "white" }}
            onClick={handleClick}
        >
            <Box flex={1}>
                <Image boxSize="100%" objectFit="cover" src={src} alt="Dan Abramov" />
            </Box>
            <Box flex={5} marginRight="5" marginLeft={3} alignItems="center">
                <Heading as="h4" size={"sm"}>
                    {name}
                </Heading>
                <Text noOfLines={1} fontSize="sm">
                    {info}
                </Text>
            </Box>

            <Box flex={1} ml="auto">
                <Text noOfLines={1} fontSize="sm">
                    {lastActivityTime}
                </Text>
                <Tag>Priority</Tag>
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
