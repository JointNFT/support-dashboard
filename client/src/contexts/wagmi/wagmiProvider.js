import WagmiContext from "./WagmiContext";
import {
    useAccount,
    useConnect,
    useDisconnect,
    useEnsAvatar,
    useEnsName,
  } from 'wagmi';
  
export default function ({ children }) {
  const { address, connector, isConnected } = useAccount();
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: address });
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();
  return (
    <WagmiContext.Provider
      value={{
        address,
        connector,
        isConnected,
        ensAvatar,
        ensName,
        connect,
        connectors,
        isLoading,
        pendingConnector,
        disconnect,
        error,
      }}
    >
     {children}
    </WagmiContext.Provider>
  );
}
