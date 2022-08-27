import { Box, Flex, Heading } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import OrganizationCard from "./OrganizationCard";
import AddOrganization from "./AddOrganization";
import web3Context from "../../contexts/web3/Web3Context";
import userContext from "../../contexts/user/UserContext";
import WagmiContext from "../../contexts/wagmi/WagmiContext";
import Loading from '../../ui/Loading';
const Organizations = () => {
  const {
    accessToken,
    setAccessToken,
    setOrganizationID,
    organization,
    setOrganization,
  } = useContext(userContext);

  const { address } = useContext(WagmiContext);
  const [organizations, setOrganizations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const storeAccessToken = (accessToken) => {
    setAccessToken(accessToken);
  };

  const storeOrganization = (organization) => {
    setOrganization(organization);
  };

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const fetchOrganizations = () => {
    setIsLoading(true);
    fetch(
      "/organizations/getOrganizationDetails?address=" + address.toLowerCase(),
      requestOptions
    ).then((res) => {
      res
        .json()
        .then(
          (resData) => {
            setIsLoading(false)
            resData && setOrganizations(resData.organizationDetails)
        }
        ).catch(error => {
            setIsLoading(false);
            console.log(error)
        });
    });
  };
  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    console.log("at changed", accessToken);
  }, [accessToken]);

  if (isLoading)
    return (
      <Box bg="blue.100" height="92vh" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
        <Flex
          direction="column"
          align="center"
          justifyContent="center"
          bg="blue.50"
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            marginTop: 50,
          }}
        >
          <Loading width={30} height={22} />
        </Flex>
        <div
            style={{
              fontWeight: 700,
              fontSize: 16,
              color: "#2A4365",
              marginTop: 30,
            }}
          >
            Fetching your organizations...
          </div>
      </Box>
    );
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
        {organizations?.length &&
          organizations.map((organization) => {
            return (
              <OrganizationCard
                storeAccessToken={storeAccessToken}
                setOrganizationID={setOrganizationID}
                storeOrganization={storeOrganization}
                organization={organization}
              />
            );
          })}
        <AddOrganization />
      </Flex>
    </Box>
  );
};

export default Organizations;
