import { Box, Flex, Heading, Image, Stack, Text } from "@chakra-ui/react";
import React from "react";

const Reciever = ({src, userName, message}) => {
  return (
    <Flex gap={"10px"} mb='10px'>
      <Box width="40px" height={"40px"}>
        <Image
          boxSize="100%"
          objectFit="cover"
          src={src}
          alt="Dan Abramov"
        />
      </Box>

      <Box flex="1">
        <Flex w={"80%"} gap="5px" alignItems={"center"} height="40px">
          <Heading as="h6" size="sm">
            {userName.slice(1,20) + '...'}
          </Heading>
          <Text>1 hour ago</Text>
        </Flex>
        <Stack mt="2" borderRadius="4px" bg="white" width={"90%"} p="2">
          <Text p="1" textAlign={"justify"}>
           {message}
          </Text>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Reciever;
