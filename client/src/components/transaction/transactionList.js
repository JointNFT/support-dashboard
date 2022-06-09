import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import './transactionList.css';

const TransactionList = (props) => {
    let transactionList = [];

    for (var i = 0; i < props.transactions.length; i += 1) {
        let tx = props.transactions[i];
        transactionList.push(
            <Accordion.Item eventKey={i}>
                <Accordion.Header>
                    Tx: {i}, Function: {tx?.decodedInput?.name}
                </Accordion.Header>
                <Accordion.Body>
                    Transaction Status: {tx.isError ? "Success" : "Failure"}
                    <br />
                    Ftmscan Link:{" "}
                    <a target="_blank" href={"https://ftmscan.com/tx/" + tx.hash}>
                        Link
                    </a>
                </Accordion.Body>
            </Accordion.Item>
        );
    }

    return (
        <div className="transaction-list">
            <Accordion defaultActiveKey="0">{transactionList}</Accordion>
        </div>
    );
};

export default TransactionList;
