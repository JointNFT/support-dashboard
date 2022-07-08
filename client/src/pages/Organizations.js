import { Link } from "react-router-dom";
import ModalForm from "../ui/Modal";

import { useEffect, useContext, useState } from "react";
import UserContext from "../contexts/user/UserContext";
import Web3Context from "../contexts/web3/Web3Context";

const Organizations = () => {
    const { accessToken, setAccessToken } = useContext(UserContext);
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
                console.log(JSON.parse(result).organizationDetails),
                setOrganizations(JSON.parse(result).organizationDetails)             
                ))
            .catch((error) => console.log("error", error));
    }

    useEffect(() => {
        console.log("at changed", accessToken);
        getOrganizationDetails(address)
    }, [accessToken]);

    if (organizations != undefined) {
        return (
            <div className="organizations">
                <h3>Organizations</h3>
                <div className="row-center">
                    {organizations.map((org) => (
                        <Link to="/conversations/all" className="org-card" onClick={() => storeAccessToken(org[0].accessToken)}>
                            <img src={org[0].image} alt="" />
                            <h4>{org[0].name}</h4>
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
                <p>Not part of any organization at the moment</p>
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
