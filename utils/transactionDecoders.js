const Web3 = require("web3");
const axios = require("axios");
const abiDecoder = require("abi-decoder"); // NodeJS

const web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.ftm.tools/"));

const otcAbi = require("../contracts/hedgyOtcABI");

const abiMap = {};

const filter_for_useful_transactions = (transactions, contractAddresses) => {
    filtered_list = [];
    let transaction;
    console.log(contractAddresses);
    for (transaction_index in transactions) {
        transaction = transactions[transaction_index];
        if (contractAddresses.includes(transaction["to"]) || contractAddresses.includes(transaction["from"])) {
            filtered_list.push(transaction);
        }
    }
    return filtered_list;
};

const populateTransactions = async (transactions, apiKey) => {
    let populatedTransactions = [];
    let abiStore = {};
    let abi;
    for (var i=0; i < transactions.length; i += 1) {
        let transaction = transactions[i];
        if (abiStore[transaction["to"]] == null) {
            abi = await getAbi(transaction["to"], apiKey);
            abiStore[transaction["to"]] = abi;
        } else {
            abi = abiStore[transaction["to"]];
        }

        if (abi == null || abi == "") {
            populatedTransactions.push(transaction);
            continue;
        }

        abiDecoder.addABI(JSON.parse(abi));
        let decodedData = abiDecoder.decodeMethod(transaction["input"]);
        transaction.decodedInput = decodedData;
        populatedTransactions.push(transaction);
    }
    return populatedTransactions;
};

const getAbi = async (address, apiKey) => {
    var config = {
        method: "get",
        url: "https://api.ftmscan.com/api?module=contract&action=getabi&address=" + address + "&apikey=" + apiKey,
        headers: {},
    };
    console.log("here");
    const res = await axios(config);

    return res.data.result;
};

module.exports = { filter_for_useful_transactions, populateTransactions };
