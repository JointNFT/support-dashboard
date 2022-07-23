import {
  chain, configureChains, createClient
} from 'wagmi'
  
  import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { infuraProvider } from 'wagmi/providers/infura'
  
  const alchemyId = process.env.ALCHEMY_ID;
  const infuraId = '85db4049c00b4783a425412807ff92e9';
  //const MAINNET_RPC_URL = "https://mainnet.infura.io/v3/85db4049c00b4783a425412807ff92e9";
  // Configure chains & providers with the Alchemy provider.
  // Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
  const { chains, provider, webSocketProvider } = configureChains(
    [chain.mainnet, chain.polygon],
    [infuraProvider({ infuraId })],)
  
  // Set up client
  const client = createClient({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains })
    ],
    provider,
    webSocketProvider,
  })
  
export default client