import { Link } from "react-router-dom";
import ModalForm from "../ui/Modal";

import { useEffect, useContext, useState } from "react";
import UserContext from "../contexts/user/UserContext";
import Web3Context from "../contexts/web3/Web3Context";
import userContext from "../contexts/user/UserContext";

const Organizations = () => {
    const { accessToken, setAccessToken, setOrganizationID } = useContext(UserContext);
    const { address, setAddress } = useContext(Web3Context);
    const [organizations, setOrganizations] = useState([]);

    const storeAccessToken = (accessToken) => {
        setAccessToken(accessToken);
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
                        <Link to="/conversations/all" 
                            className="org-card" 
                            onClick={() =>{ 
                                storeAccessToken(org.accessToken);
                                setOrganizationID(org.organizationId)
                                }}>
                            <img src={org.image} alt="" />
                            <h4>{org.name}</h4>
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
