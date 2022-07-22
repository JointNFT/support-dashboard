import { Box, Flex, Heading } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import OrganizationCard from "./OrganizationCard";
import AddOrganization from "./AddOrganization";
import web3Context from "../../contexts/web3/Web3Context";
import userContext from "../../contexts/user/UserContext";

const Organizations = () => {
    const { accessToken, setAccessToken, setOrganizationID, organization, setOrganization } = useContext(userContext);

    const { address } = useContext(web3Context);
    const [organizations, setOrganizations] = useState([]);

    const storeAccessToken = (accessToken) => {
        setAccessToken(accessToken);
    };

    const storeOrganization = (organization) => {
        setOrganization(organization);
    };

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    useEffect(() => {
        fetch("/getOrganizationDetails?address=" + address.toLowerCase(), requestOptions).then((res) => {
            res.json().then((resData) => resData && setOrganizations(resData.organizationDetails));
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
            <Heading w={"90%"} mx="auto" fontSize={"26px"} mb="20px" pt="20px" textAlign={"center"}>
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
                {organizations.length &&
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
