import { Box, Flex, Heading } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import OrganizationCard from "./OrganizationCard";
import AddOrganization from "./AddOrganization";
import userContext from "../../contexts/user/UserContext";

const Organizations = () => {
  const { accessToken, setAccessToken } = useContext(userContext);
  const [organizations, setOrganizations] = useState([]);

  const storeAccessToken = (accessToken) => {
    setAccessToken(accessToken);
  };

  useEffect(() => {
    fetch(
      "https://63t2to8zja.execute-api.ap-south-1.amazonaws.com/default/getUsersOrganizations"
    ).then((res) => {
      res
        .json()
        .then(
          (resData) => resData && setOrganizations(resData.organizationList)
        );
    });
  }, []);

  useEffect(() => {
    console.log("at changed", accessToken);
  }, [accessToken]);

  return (
    <Box
      w={"100%"}
      height={{
        base: "100vh",
        md: "auto",
        sm: "auto",
      }}
      bg="blue.100"
      paddingBottom="32"
    >
      <Heading
        w={"90%"}
        mx="auto"
        fontSize={"26px"}
        mb="20px"
        pt="20px"
        textAlign={"center"}
      >
        Select organization
      </Heading>
      <Flex
        justifyContent="center"
        height={"100%"}
        width="90%"
        mx={"auto"}
        gap="30px"
        flexWrap={"wrap"}
        flexDirection={{ lg: "row", md: "column", sm: "column" }}
      >

        { organizations.length && organizations.map(organization => {
          return <OrganizationCard storeAccessToken={storeAccessToken} organization={organization} />
        }) }
        <AddOrganization />
      </Flex>
    </Box>
  );
};

export default Organizations;