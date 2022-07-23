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
      {isConnected ? (
        children
      ) : (
        <div>
          {connectors.map((connector) => (
            <button
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => connect({ connector })}
            >
              {connector.name}
              {!connector.ready && " (unsupported)"}
              {isLoading &&
                connector.id === pendingConnector?.id &&
                " (connecting)"}
            </button>
          ))}

          {error && <div>{error.message}</div>}
        </div>
      )}
    </WagmiContext.Provider>
  );
}
