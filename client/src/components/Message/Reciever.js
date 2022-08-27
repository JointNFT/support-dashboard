import { Box, Flex, Heading, Image, Stack, Text } from "@chakra-ui/react";
import React from "react";
import ImageModal from "../../ui/ImageModal";

const Receiver = ({ src, userName, message, attachment, sentTime }) => {
  return (
    <Flex gap={"10px"} mb="10px">
      <Box width="32px" height={"32px"}>
        <Image
          boxSize="100%"
          objectFit="cover"
          src={src}
          alt="Dan Abramov"
          borderRadius="6px"
          fallbackSrc="../fallbackImg.png"
        />
      </Box>

      <Box flex="1">
        <Flex w={"80%"} gap="5px" alignItems={"center"} height="40px">
          <Heading as="h6" size="sm">
            {userName.slice(0, 20) + "..."}
          </Heading>
          <Text>{sentTime}</Text>
        </Flex>
        <Stack
          mt="2"
          borderRadius="4px"
          bg="white"
          width={attachment ? "fit-content" : "90%"}
          p="2"
          boxShadow="base"
        >
          {attachment ? (
            <ImageModal src={attachment} />
          ) : (
            <Text p="1" textAlign={"justify"} wordBreak="break-word">
              {message}
            </Text>
          )}
        </Stack>
      </Box>
    </Flex>
  );
};

export default Receiver;
