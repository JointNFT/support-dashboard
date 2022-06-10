import React, { useState } from "react";
import Form from 'react-bootstrap/Form'
import { Button } from 'react-bootstrap';


const AddressForm = (props) => {
    let [userAddress, setUserAddress] = useState("0x5c146cd18fa53914580573c9b9604588529406ca");
    let [contractAddresses, setContractAddresses] = useState("0xad337077480134028b7c68af290e891ce28076eb");
    let [chain, setChain] = useState("ftm");

    const handleUserAddresInput = (e) => {
        setUserAddress(e.target.value);
    };

    const handleContractAddressInput = (e) => {
        setContractAddresses(e.target.value);
    };

    const handleSelectInput = (e) => {
        setChain(e.target.value);
    }

    const send = (e) => {
        props.fetchTx(userAddress, contractAddresses, chain);
    };

    return (
        <div className="address-input">
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Customer Address</Form.Label>
                <Form.Control type="text" id="userAdderss" onChange={handleUserAddresInput} value={userAddress}/>
                <Form.Text className="text-muted">
                    Enter the address of the customer to search
                </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Contract Addresses</Form.Label>
                <Form.Control type="text" id="contractAddress" onChange={handleContractAddressInput} value={contractAddresses}/>
                <Form.Text className="text-muted">
                    Comma seperated contract address to filter for
                </Form.Text>
            </Form.Group>
            
            <Form.Select aria-label="Default select example" size="sm" onChange={handleSelectInput}>
                <option value="ftm">FATOM</option>
                <option value="eth">ETHEREUM</option>
            </Form.Select>  
            <Button onClick={send} variant="primary" className="fetch-tx-button" >Fetch Transactions</Button>
        </div>
    );
};

export default AddressForm;
