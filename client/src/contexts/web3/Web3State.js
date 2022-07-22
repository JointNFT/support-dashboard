import { useReducer } from "react";
import Web3Context from "./Web3Context";
import Web3Reducer, { initialState } from "./Web3Reducer";
import { FaRocketchat } from "react-icons/fa";
import Web3 from "web3";

import Onboard from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";

const MAINNET_RPC_URL =
  "https://mainnet.infura.io/v3/85db4049c00b4783a425412807ff92e9";

const injected = injectedModule();

const onboard = Onboard({
  wallets: [injected],
  chains: [
    {
      id: "0x1",
      token: "ETH",
      label: "Ethereum Mainnet",
      rpcUrl: MAINNET_RPC_URL,
    },
  ],
  appMetadata: {
    name: "Token Swap",
    icon: FaRocketchat.toString(),
    description: "Swap tokens for other tokens",
    recommendedInjectedWallets: [
      { name: "MetaMask", url: "https://metamask.io" },
    ],
  },
	
	accountCenter: {
    desktop: {
      position: 'topRight',
      enabled: false,
      minimal: true
    },
    mobile: {
      position: 'topRight',
      enabled: false,
      minimal: true
    }
  },
});

const Web3State = (props) => {
	const [state, dispatch] = useReducer(Web3Reducer, initialState);

	const handleAccountsChanged = (accounts) => {
		// eslint-disable-next-line no-console
		
		console.log('accountsChanged', accounts)
		dispatch({
		  type: 'SET_ADDRESS',
		  address: accounts[0],
		})
	}

	// https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
	const handleChainChanged = (_hexChainId) => {
		window.location.reload()
	}

	const handleDisconnect = async() => {
		// eslint-disable-next-line no-console
		console.log('handling disconnect')
		try{
			await onboard.disconnectWallet();
		} catch(error) {
			console.log(error);
			console.log('tried disconnecting wallet after wallet was disconnected')
		}
		dispatch({
			type: 'RESET_WEB3_PROVIDER',
		  })
	}

	const connect = async () => {
		setLoading();
		setDisplayMessage('Connecting To Wallet Provider')

		let provider;
		let accounts;
		try {
			accounts =  await onboard.connectWallet();
			provider = accounts[0].provider;
		} catch (e) {
			console.log(e);
			dispatch({type:'RESET_WEB3_PROVIDER'})
			return
		}
		const web3Provider = new Web3(provider);
		setDisplayMessage('Fetching Account address')
		const address = provider.selectedAddress;
		const networkId = await web3Provider.eth.net.getId();

		provider.on('accountsChanged', handleAccountsChanged)
		provider.on('chainChanged', handleChainChanged)
		provider.on('disconnect', handleDisconnect)

		setDisplayMessage('Wallet Connected Successfully')

		dispatch({
		  type: 'SET_WEB3_PROVIDER',
		  provider,
		  web3Provider,
		  address,
		  chainId: networkId
		})		
	};

	const removeListeners = (provider) => {
		provider.removeListener('accountsChanged', handleAccountsChanged)
		provider.removeListener('chainChanged', handleChainChanged)
		provider.removeListener('disconnect', handleDisconnect)
	}

	

	const setLoading = () => dispatch({ type: 'SET_LOADING' });

	const setDisplayMessage = (message) => dispatch({ type: 'SET_DISPLAY_MESSAGE', payload: message });

	return (
		<Web3Context.Provider
			value={{
				web3Loading: state.web3Loading,
				provider: state.provider,
				web3Provider: state.web3Provider,
				address: state.address,
				chainId: state.chainId,
				web3Modal: state.web3Modal,
				web3DisplayMessage: state.web3DisplayMessage,
				connect,
				handleDisconnect
			}}
		>
			{props.children}
		</Web3Context.Provider>
		)
}


export default Web3State;
