import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading, Image, Menu, MenuButton, MenuItem, MenuList, propNames, Stack, Tag, Text } from "@chakra-ui/react";
import React, { forwardRef } from "react";

const MessageHeader = ({ src, userName, lastMessage, onCloseConversation, prioritizeConversation, organization, assignConversation }) => {
    const closeConversation = async () => {
        await onCloseConversation();
        window.location.href = "/conversations/all";
    };
    const markPrioritized = async () => {
        await prioritizeConversation();
        window.location.href = "/conversations/all";
    };
    return (
        <Flex align="center" mb={"5"} width="100%" as={"a"} href="#" mt="3">
            <Box width="60px">
                <Image boxSize="100%" objectFit="cover" src={src} alt={userName} />
            </Box>

            <Box flex={5} marginRight="5" alignItems="center" ml="3">
                <Heading as="h4" size={"sm"} color="#2C5282">
                    {userName.slice(1, 20) + "..."}
                </Heading>
                <Text noOfLines={1} fontSize="sm">
                    {lastMessage.message}
                </Text>
            </Box>

            <Box flex={1} ml="auto" display={"flex"} py="2" justifyContent="right" alignItems={"center"}>
                <Stack direction={"row"} alignItems="center" mr={"2"}>
                    <Text>Time: </Text>
                    <Tag bg={"pink.100"}>11:05</Tag>
                </Stack>
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        Options
                    </MenuButton>
                    <MenuList>
                        {/*<MenuItem isDisabled>Download</MenuItem>
            <MenuItem isDisabled>Create a Copy</MenuItem>
            <MenuItem isDisabled>Mark as Draft</MenuItem>
            <MenuItem isDisabled>Delete</MenuItem>
            <MenuItem isDisabled>Attend a Workshop</MenuItem>*/}
                        <MenuItem onClick={() => markPrioritized()}>Mark as prioritized</MenuItem>
                        <MenuItem onClick={() => closeConversation()}>Close conversation</MenuItem>
                    </MenuList>
                </Menu>
                
            </Box>
        </Flex>
    );
};

export default MessageHeader;
