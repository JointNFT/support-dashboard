import { Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

const OrganizationStack = ({ fieldName, fieldData, fieldPercent, button, icon, to }) => {
  console.log( fieldPercent)
  return (
    <Stack bg="blue.50" rounded={"lg"} padding="10px" margin={"10px 0"}>
      <Text fontSize={"16px"} textTransform="capitalize">{fieldName}</Text>
      <Flex justifyContent="space-between" alignItems={"center"}>
        <Heading fontSize={"18px"}>{fieldData}</Heading>
        {button && (
          <Button colorScheme="gray" color="darkblue.100" as={Link} to={to}>
            {button}
          </Button>
        )}
      </Flex>
      { isNaN(Math.abs(fieldPercent))? (<Text fontSize={"16px"}></Text>) : (
        <Text fontSize={"16px"}>
          {Math.abs(fieldPercent)?.toFixed(1)}%{" "}
          {icon === "up" ? (
            <ChevronDownIcon color={"red"} />
          ) : (
            <ChevronUpIcon color={"green"} />
          )}{" "}
        </Text>
      )}{" "}
    </Stack>
  );
};

export default OrganizationStack;
