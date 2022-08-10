import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image, Text
} from "@chakra-ui/react";
import { Menu, MenuItem, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
const MessageHeader = ({
  src,
  userName,
  lastMessage,
  onCloseConversation,
  prioritizeConversation,
  organization,
  assignConversation,
  assignedTo,
}) => {
  const closeConversation = async () => {
    await onCloseConversation();
  };
  const markPrioritized = async () => {
    await prioritizeConversation();
  };
  const ref = React.useRef();
  return (
    <Flex align="center" mb={"5"} width="100%" mt="3" as="a">
      <Box width="60px">
        <Image
          boxSize="100%"
          objectFit="cover"
          src={src}
          alt={userName}
          borderRadius="6px"
          fallbackSrc="../fallbackImg.png"
        />
      </Box>

      <Box flex={5} marginRight="5" alignItems="center" ml="3" maxWidth="50%">
        <Heading as="h4" size={"sm"} color="#2C5282">
          {userName.slice(1, 20) + "..."}
        </Heading>
        <Text noOfLines={1} fontSize="sm">
          {lastMessage != null ? lastMessage.message : '' }
        </Text>
      </Box>

      <Box
        flex={1}
        ml="auto"
        display={"flex"}
        py="2"
        justifyContent="right"
        alignItems={"center"}
      >
        {/*  <Stack direction={"row"} alignItems="center" mr={"2"}>
                    <Text>Time: </Text>
                    <Tag bg={"pink.100"}>11:05</Tag>
                </Stack> */}
     
        <Menu
          menuButton={
            <Button
              as={Button}
              rightIcon={<ChevronDownIcon />}
              colorScheme="blue"
            >
              Options
            </Button>
          }
        >
          {/*<MenuItem isDisabled>Download</MenuItem>
            <MenuItem isDisabled>Create a Copy</MenuItem>
            <MenuItem isDisabled>Mark as Draft</MenuItem>
            <MenuItem isDisabled>Delete</MenuItem>
            <MenuItem isDisabled>Attend a Workshop</MenuItem>*/}
          <MenuItem onClick={() => markPrioritized()}>
            Mark as prioritized
          </MenuItem>
          <MenuItem onClick={() => closeConversation()}>
            Close conversation
          </MenuItem>
            <SubMenu label="Assign to">
              {organization?.addresses?.map((address) => (
                <MenuItem>
                  <Box
                    py="3px"
                    fontSize="14px"
                    onClick={() => {
                      if (address !== assignedTo) {
                        assignConversation(address);
                      }
                    }}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    gap="20px"
                  >
                    <div>{address}</div>
                    <div>
                    {address === assignedTo && (
                      <FaCheckCircle size={14} color="#38A169" />
                    )}
                  </div>
                  </Box>

                </MenuItem>
              ))}
            </SubMenu>
        </Menu>
      </Box>
    </Flex>
  );
};

export default MessageHeader;
