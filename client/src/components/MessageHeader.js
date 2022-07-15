import { ChevronDownIcon } from "@chakra-ui/icons";
import {
    Box, Button, Flex,
    Heading, Image, Menu,
    MenuButton, MenuItem,
    MenuList, Stack,
    Tag,
    Text
} from "@chakra-ui/react";
import React from "react";

const MessageHeader = ({src, userName}) => {
  return (
    <Flex align="center" mb={"5"} width="100%" as={"a"} href="#" mt="3">
      <Box width="60px">
        <Image
          boxSize="100%"
          objectFit="cover"
          src={src}
          alt={userName}
        />
      </Box>

      <Box flex={5} marginRight="5" alignItems="center" ml="3">
        <Heading as="h4" size={"sm"} color='#2C5282'>
          {userName.slice(1,20) + '...'}
        </Heading>
        <Text noOfLines={1} fontSize="sm">
          "The quick brown fox jumps over the lazy dog".
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
        <Stack direction={"row"} alignItems="center" mr={"2"}>
          <Text>Time: </Text>
          <Tag bg={"pink.100"}>11:05</Tag>
        </Stack>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Assign to Me
          </MenuButton>
          <MenuList>
            <MenuItem>Download</MenuItem>
            <MenuItem>Create a Copy</MenuItem>
            <MenuItem>Mark as Draft</MenuItem>
            <MenuItem>Delete</MenuItem>
            <MenuItem>Attend a Workshop</MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
};

export default MessageHeader;
