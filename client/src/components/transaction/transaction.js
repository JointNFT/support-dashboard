import React, { useState } from "react";
import "./transaction.css";
import AddressForm from "./addressForm";
import TransactionList from "./transactionList";
const SERVER = "http://localhost:3000";

const Transaction = () => {
  let [transactions, setTransactions] = useState([]);

  const fetchTransactions = async (userAddress, contractAddresses) => {
    fetch(
      SERVER +
        "/transactions?userAddress=" +
        userAddress +
        "&contractAddresses=" +
        contractAddresses
    ).then(async (response) => {
      let data = await response.json();
      setTransactions(data.filteredTransactions);
      console.log(transactions);
    });
  };

  return (
    <div>
      <AddressForm fetchTx={fetchTransactions} />
      <TransactionList transactions={transactions} />
    </div>
  );
};

export default Transaction;
