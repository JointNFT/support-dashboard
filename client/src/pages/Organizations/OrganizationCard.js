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
import { Link } from "react-router-dom";

const OrganizationCard = ({ storeAccessToken, organization, setOrganizationID, storeOrganization }) => {
  return (
    <Box
      width={{ xl: "25%", lg: "30%", sm: "100%", md: "100%" }}
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
        <Image src={organization.image} width='50px' />
        <Text fontSize="18px">{organization.title}</Text>
      </Flex>
      <HStack>
        <Button
          as={Link}
          to={"/conversations/all"}
          onClick={() => {
            storeAccessToken(organization.accessToken)
            setOrganizationID(organization.organizationId)
            storeOrganization(organization)
          }}
          colorScheme="blue"
          width={"70%"}
        >
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
        <OrganizationStack fieldName = {'All Conversations'} fieldData = {organization.totalConversations} fieldPercent ={organization.totalPercentage} icon={organization.totalSign}/>
        <OrganizationStack fieldName = {'Prioritized'} fieldData = {organization.prioritized} fieldPercent={organization.prioritizedPercentage} button={"Open"} icon={organization.prioritizedSign} />
        <OrganizationStack fieldName = {'Closed Conversations'} fieldData = {organization.closed} fieldPercent={organization.closedPercentage} icon={organization.closedSign} />
        <OrganizationStack fieldName = {'Customers'} fieldData = {organization.customers} fieldPercent={organization.customerPercentage} icon={organization.customerSign} />
        <OrganizationStack fieldName = {'staff'} fieldData = {organization.staff} fieldPercent={organization.staffPercentage} icon={organization.staffSign}/>
      </Flex>
    </Box>
  );
};

export default OrganizationCard;
