const filter_for_useful_transactions = (transactions, contractAddresses) => {
    filtered_list = []
    let transaction;
    console.log(contractAddresses);
    for (transaction_index in transactions){
        transaction = transactions[transaction_index];
        if (contractAddresses.includes(transaction["to"]) || contractAddresses.includes(transaction["from"])) {
            filtered_list.push(transaction)
        }
    }
    return filtered_list
}

module.exports = {filter_for_useful_transactions};
