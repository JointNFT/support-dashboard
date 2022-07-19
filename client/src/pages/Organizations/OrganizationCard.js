import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import AddOrganization from "./AddOrganization";
import OrganizationStack from "./OrganizationStack";

const OrganizationCard = () => {
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
        gap='10px'
      >
        <Image src="/Vector.png" />
        <Text fontSize='18px'>MegaCrypto</Text>
      </Flex>
      <HStack>
        <Button colorScheme="blue" width={"70%"}>
          Open Conversations
        </Button>
        <Button colorScheme="gray" color="darkblue.100" width="30%">
          Settings
        </Button>
      </HStack>
      <Heading textAlign={"center"} as="h6" fontSize={"18px"} padding={22}>
        Todays data
      </Heading>
      <Flex direction={"column"} justifyContent="space-between">
        <OrganizationStack />
        <OrganizationStack button={"Open"} icon="up" />
        <OrganizationStack icon="up" />
        <OrganizationStack icon="down" />
        <OrganizationStack />
      </Flex>
    </Box>
  );
};

export default OrganizationCard;
