import { Link } from "react-router-dom";
import ModalForm from "../ui/Modal";

import { useEffect, useContext, useState } from "react";
import UserContext from "../contexts/user/UserContext";
import Web3Context from "../contexts/web3/Web3Context";
import userContext from "../contexts/user/UserContext";
import {
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    StatGroup,
  } from '@chakra-ui/react'

const Organizations = () => {
    const { accessToken, setAccessToken } = useContext(UserContext);
    const {organization , setOrganization} = useContext(userContext);
    const { address, setAddress } = useContext(Web3Context);
    const [organizations, setOrganizations] = useState([]);

    const storeAccessToken = (accessToken) => {
        setAccessToken(accessToken);
    };
    const storeOrganization = (organization) => {
        setOrganization(organization);
    };

    function getOrganizationDetails(userAddress) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",            
        };

        fetch("/getOrganizationDetails?address=" + userAddress, requestOptions)
            .then((response) => response.text())
            .then((result) => (
                setOrganizations(JSON.parse(result).organizationDetails)             
                ))
            .catch((error) => console.log("error", error));
    }

    useEffect(() => {
        console.log("at changed", accessToken);
        getOrganizationDetails(address)
    }, [accessToken]);

    if (organizations.length != 0) {
        return (
            <div className="organizations">
                <h3>Organizations</h3>
                <div className="row-center">
                    {organizations.map((org) => (
                        <Link to="/conversations/all" className="org-card" onClick={() => storeOrganization(org)}>
                            <img src={org.image} alt="" />
                            <h4>{org.name}</h4>
                            <StatGroup>
                                <Stat>
                                    <StatLabel>All Conversations</StatLabel>
                                    <StatNumber>{org.totalConversations}</StatNumber>
                                    <StatHelpText>
                                        <StatArrow type={org.totalSign} />
                                        {org.totalPercentage}%
                                    </StatHelpText>
                                </Stat>
                                <br/>
                                <Stat>
                                    <StatLabel>Prioritized</StatLabel>
                                    <StatNumber>{org.prioritized}</StatNumber>
                                    <StatHelpText>
                                        <StatArrow type={org.prioritizedSign} />
                                        {org.prioritizedPercentage}% 
                                    </StatHelpText>
                                </Stat>
                                <br/>
                                <Stat>
                                    <StatLabel>Closed Conversations</StatLabel>
                                    <StatNumber>{org.closed}</StatNumber>
                                    <StatHelpText>
                                        <StatArrow type={org.closedSign} />
                                        {org.closedPercentage}%
                                    </StatHelpText>
                                </Stat>
                                <br/>
                                <Stat>
                                    <StatLabel>Customers</StatLabel>
                                    <StatNumber>{org.customers}</StatNumber>
                                    <StatHelpText>
                                        <StatArrow type={org.customerSign} />
                                        {org.customerPercentage}%
                                    </StatHelpText>
                                </Stat>
                                <br/>
                                <Stat>
                                    <StatLabel>Staff</StatLabel>
                                    <StatNumber>{org.staff}</StatNumber>
                                    <StatHelpText>
                                        <StatArrow type={org.staffSign} />
                                        {org.staffPercentage}%
                                    </StatHelpText>
                                </Stat>
                            </StatGroup>
                        </Link>
                    ))}

                    <button className="custom-btn">
                        <ModalForm />
                    </button>
                </div>
            </div>
        );
    } else {
        return (
            <div className="organizations">
                <h3>Organizations</h3>
                <h6>Not part of any organization at the moment</h6>
                <div className="row-center">
                    <button className="custom-btn">
                        <ModalForm />
                    </button>
                </div>
            </div>
        );
    }
};

export default Organizations;
