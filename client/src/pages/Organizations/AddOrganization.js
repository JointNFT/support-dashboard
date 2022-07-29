import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";

const AddOrganization = () => {
  return (
    <Box
      width={{ xl: '25%', lg: "30%", sm: "100%", md: "100%" }}
      bg="white"
      rounded={"lg"}
      height={{
        base: "90vh",
        md: "auto",
      }}
      padding={"10px"}
    >
      <Flex
        justifyContent={"center"}
        alignItems="center"
        as="h6"
        fontSize={"22px"}
        padding={22}
        gap="10px"
      >
        <AddIcon color='green' height="50px" />
        <Text fontSize="18px">Add</Text>
      </Flex>
      <HStack justifyContent="center">
        <Button colorScheme="blue">Add New Company</Button>
      </HStack>
    </Box>
  );
};

export default AddOrganization;
