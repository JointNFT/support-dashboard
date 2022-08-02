import { chain, configureChains, createClient } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { infuraProvider } from "wagmi/providers/infura";

const infuraId = process.env.REACT_APP_INFURA_ID;
const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, chain.polygon],
  [infuraProvider({ apiKey: infuraId })]
);

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  provider,
  webSocketProvider,
});

export default client;
