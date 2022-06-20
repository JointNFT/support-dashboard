import React, {useState} from "react";

const AddressForm = (props) => {
    let [userAddress, setUserAddress] = useState('0x5c146cd18fa53914580573c9b9604588529406ca');
    let [contractAddresses, setContractAddresses] = useState('0xad337077480134028b7c68af290e891ce28076eb');

    const handleUserAddresInput = (e) => {
        setUserAddress(e.target.value);
    } 

    const handleContractAddressInput = (e) => {
        setContractAddresses(e.target.value);
    } 

    const send = (e) => {
        props.fetchTx(userAddress, contractAddresses);
    }

    return (
        <div className="address-input">
                        <input type="text" id="userAdderss" onChange={handleUserAddresInput} value={userAddress} ></input>
                        <input type="text" id="contractAddress" onChange={handleContractAddressInput} value={contractAddresses} ></input>
                        <button onClick={send}>Fetch Transactions</button>
        </div>
    );
};

export default AddressForm;