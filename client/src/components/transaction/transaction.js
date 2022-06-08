import React, {useState} from "react";
import './transaction.css'
import AddressForm from "./addressForm";
import TransactionList from "./transactionList";

const Transaction = () => {
    let [transactions, setTransactions] = useState([]);

    const fetchTransactions = async (userAddress, contractAddresses) => {
        fetch('/transactions?userAddress='+userAddress+'&contractAddresses='+contractAddresses).then(async response => {
            let data = await response.json();
            setTransactions(data.filteredTransactions);
            console.log(transactions);
        })
    }

    return (
        <div className="transaction">
        <AddressForm fetchTx={fetchTransactions}/>
        <TransactionList transactions={transactions}/>        
        </div>
    );
};

export default Transaction;