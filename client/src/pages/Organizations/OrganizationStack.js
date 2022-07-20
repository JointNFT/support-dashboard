import { Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

const OrganizationStack = ({ button, icon }) => {
  return (
    <Stack bg="blue.50" rounded={"lg"} padding="10px" margin={"10px 0"}>
      <Text fontSize={"16px"}>All Conversations</Text>
      <Flex justifyContent="space-between" alignItems={"center"}>
        <Heading fontSize={"18px"}>31</Heading>
        {button && (
          <Button colorScheme="gray" color="darkblue.100">
            {button}
          </Button>
        )}
      </Flex>
      <Text fontSize={"16px"}>
        8.05%{" "}
        {icon === "up" ? (
          <ChevronDownIcon color={"red"} />
        ) : (
          <ChevronUpIcon color={"green"} />
        )}{" "}
      </Text>
    </Stack>
  );
};

export default OrganizationStack;
