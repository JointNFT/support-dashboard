const Web3 = require("web3");
const axios = require("axios");
const abiDecoder = require("abi-decoder"); // NodeJS
require("dotenv").config({path: '../.env'});

const web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.ftm.tools/"));

const otcAbi = require("../contracts/hedgyOtcABI");

const scannerMap = {eth: {
    apiKey: process.env.ETHERSCAN_API_KEY,
    getAbi: 'https://api.etherscan.io/api?module=contract&action=getabi&address=REPLACE_ADDRESS&apiKey=REPLACE_APIKEY',
    getTx: 'https://api.etherscan.io/api?module=account&action=txlist&address=REPLACE_ADDRESS&startblock=REPLACE_STARTBLOCK&endblock=999999999&sort=asc&apiKey=REPLACE_APIKEY'
},
ftm: {
    apiKey: process.env.FTM_SCAN_API_KEY,
    getAbi: 'https://api.ftmscan.com/api?module=contract&action=getabi&address=REPLACE_ADDRESS&apiKey=REPLACE_APIKEY',
    getTx: 'https://api.ftmscan.com/api?module=account&action=txlist&address=REPLACE_ADDRESS&startblock=REPLACE_STARTBLOCK&endblock=999999999&sort=asc&apiKey=REPLACE_APIKEY'

},
poly: {
    apiKey: process.env.POLYSCAN_API_KEY,
    getAbi: 'https://api.polygonscan.com/api?module=contract&action=getabi&address=REPLACE_ADDRESS&apiKey=REPLACE_APIKEY',
    getTx: 'https://api.polygonscan.com/api?module=account&action=txlist&address=REPLACE_ADDRESS&startblock=REPLACE_STARTBLOCK&endblock=999999999&sort=asc&apiKey=REPLACE_APIKEY'

}};

console.log('key',scannerMap['ftm'].apiKey)


const getTransactions = async (address, startblock, chain) => {
    let url = scannerMap[chain].getTx.replace('REPLACE_ADDRESS', address).replace('REPLACE_STARTBLOCK', startblock).replace('REPLACE_APIKEY', scannerMap[chain].apiKey);
    const axiosRes = await axios.get(url);
    const userTransactions = axiosRes?.data?.result;
    console.log(userTransactions.length);
    return userTransactions;
}

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

const populateTransactions = async (transactions, chain) => {
    let populatedTransactions = [];
    let abiStore = {};
    let abi;
    for (var i=0; i < transactions.length; i += 1) {
        let transaction = transactions[i];
        if (abiStore[transaction["to"]] == null) {
            abi = await getAbi(transaction["to"], chain);
            abiStore[transaction["to"]] = abi;
        } else {
            abi = abiStore[transaction["to"]];
        }

        if (abi == null || abi == "") {
            populatedTransactions.push(transaction);
            continue;
        }
        try {
            abiDecoder.addABI(JSON.parse(abi));
            let decodedData = abiDecoder.decodeMethod(transaction["input"]);
            transaction.decodedInput = decodedData;
        } catch (err) {
            console.log('meh, decoding didnt work', err);
        }
        
        populatedTransactions.push(transaction);
    }
    return populatedTransactions;
};

const getAbi = async (address, chain) => {
    var config = {
        method: "get",
        url: scannerMap[chain].getAbi.replace('REPLACE_ADDRESS', address).replace('REPLACE_APIKEY', scannerMap[chain].apiKey),
        headers: {},
    };
    const res = await axios(config);
    return res.data.result;
};

module.exports = { filter_for_useful_transactions, populateTransactions, getTransactions };
