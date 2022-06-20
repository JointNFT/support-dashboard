import React, {useState} from "react";
import Accordion from 'react-bootstrap/Accordion'

const TransactionList = (props) => {
    let transactionList = [];

    for (var i=0; i<props.transactions.length; i+=1) {
        let tx = props.transactions[i];
        transactionList.push(
            <Accordion.Item eventKey={i}>
                <Accordion.Header >Transaction: {i}</Accordion.Header>
                <Accordion.Body>
                    Transaction Status: {tx.isError ? 'Success' : 'Failure'}
                    <br/>
                    Etherscan Link: <a target="_blank" href={'https://ftmscan.com/tx/'+tx.hash}>Link</a>
                </Accordion.Body>
            </Accordion.Item>
        )
    }

    return (
        <Accordion defaultActiveKey="0" >
            {transactionList}
        </Accordion>
    );
};

export default TransactionList;