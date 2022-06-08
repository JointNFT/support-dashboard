import React from "react";

const AddressForm = (props) => {
    let state = {'userAddress': "0x5c146cd18fa53914580573c9b9604588529406ca", contractAddresses:"0xad337077480134028b7c68af290e891ce28076eb"}
    console.log(props);
    const handleInput = (e) => {
        state[e.target.id] = e.target.value;
    } 
    const send = (e) => {
        console.log(e);
    }

    return (
        <div className="address-input">
                        <input type="text" id="userAdderss" onChange={handleInput} value={state.userAddress} ></input>
                        <input type="text" id="contractAddress" onChange={handleInput} value={state.contractAddresses} ></input>
                        <button onClick={send}>Fetch Transactions</button>
        </div>
    );
};

export default AddressForm;