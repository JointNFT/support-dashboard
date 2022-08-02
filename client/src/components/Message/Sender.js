import { Box, Flex, Heading, Image, Stack, Text } from "@chakra-ui/react";
import React from "react";

const Sender = ({message, src}) => {
  return (
    <Flex gap={"10px"} mt="5" mr="5">
      <Box flex="1">
        <Flex
          w={"80%"}
          gap="5px"
          alignItems={"center"}
          height="40px"
          justify={"right"}
          ms="auto"
        >
          <Heading as="h6" size="sm">
            Adam
          </Heading>
        </Flex>
        <Stack
          mt="2"
          borderRadius="4px"
          bg="white"
          width={"90%"}
          p="2"
          ms="auto"
        >
          <Text p="1" textAlign={"justify"}>
            {message}
          </Text>
        </Stack>
      </Box>

      <Box width="40px" height={"40px"}>
        <Image
          boxSize="100%"
          objectFit="cover"
          src={src}
          alt="Dan Abramov"
        />
      </Box>
    </Flex>
  );
};

export default Sender;
