import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  propNames,
  Stack,
  Tag,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
} from "@chakra-ui/react";
import React, { forwardRef } from "react";
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
          {lastMessage.message}
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
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            colorScheme="blue"
          >
            Options
          </MenuButton>
          <MenuList>
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
            <MenuItem>
              <Popover
                initialFocusRef={ref}
                placement="right-start"
                trigger="hover"
              >
                <PopoverTrigger>
                  <Box textAlign="left" width="100%">
                    Assign to
                  </Box>
                </PopoverTrigger>
                <PopoverContent width="max-content" boxShadow="base">
                  <PopoverHeader>Staff addresses:</PopoverHeader>
                  <PopoverBody>
                    <Flex
                      direction={"column"}
                      width="max-content"
                      align={"flex-start"}
                    >
                      {organization.addresses.map((address) => (
                        <Flex
                          width="100%"
                          justify="space-between"
                          gap="20px"
                          align="center"
                          px="5px"
                          sx={{ "&:hover": { backgroundColor: "gray.200" } }}
                        >
                          <Box py="3px" 
                                fontSize="14px"
                                 onClick={() =>{ 
                                    if(address !== assignConversation) {
                                        assignConversation(address);
                                    }
                                }}>
                            {address}
                          </Box>
                          <div>
                            { address === assignedTo && (
                              <FaCheckCircle size={14} color="#38A169" />
                            )}
                          </div>
                        </Flex>
                      ))}
                    </Flex>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
};

export default MessageHeader;
