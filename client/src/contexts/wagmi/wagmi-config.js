import { chain, configureChains, createClient } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { infuraProvider } from "wagmi/providers/infura";

const infuraId = "85db4049c00b4783a425412807ff92e9";
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
