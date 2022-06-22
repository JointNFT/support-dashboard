import { Link } from "react-router-dom";
import ModalForm from "../ui/Modal";

import { useEffect, useContext, useState } from "react";
import UserContext from "../contexts/user/UserContext";

const Organizations = () => {
    const { accessToken, setAccessToken } = useContext(UserContext);
    const [organizations, setOrganizations] = useState([]);

    const storeAccessToken = (accessToken) => {
        setAccessToken(accessToken);
    };

    useEffect(() => {
        fetch("https://63t2to8zja.execute-api.ap-south-1.amazonaws.com/default/getUsersOrganizations").then((res) => {
            res.json().then((resData) => resData && setOrganizations(resData.organizationList));
        });
    }, []);

    useEffect(() => {
        console.log("at changed", accessToken);
    }, [accessToken]);

    return (
        <div className="organizations">
            <h3>Organizations</h3>
            <div className="row-center">
                {organizations.map((org) => (
                    <Link to="/conversations/all" className="org-card" onClick={() => storeAccessToken(org.accessToken)}>
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
};

export default Organizations;
