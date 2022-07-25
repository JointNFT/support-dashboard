import React from "react";
import WagmiContext from "./WagmiContext";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useNetwork,
  useSignMessage,
} from "wagmi";
import { SiweMessage } from "siwe";
export default function ({ children }) {
  const { address, connector, isConnected } = useAccount();
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: address });
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { chain: activeChain } = useNetwork();

  const [state, setState] = React.useState({
    address: null,
    error: null,
    loading: false,
  });
  const signOut = async () => {
    await fetch("/wagmi/logout");
    setState({});
  };
  const signIn = React.useCallback(async () => {
    try {
      const chainId = activeChain?.id;
      if (!address || !chainId) return alert("No account or chain");

      // set loading to true
      setState((x) => ({ ...x, error: undefined, loading: true }));

      // Fetch random nonce, create SIWE message, and sign with wallet
      const nonceRes = await fetch("/wagmi/nonce");
  
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce: await nonceRes.text(),
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      if (!signature) throw Error("Signature is empty");

      // Verify signature
      const verifyRes = await fetch("/wagmi/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, signature }),
      });
      if (!verifyRes.ok) throw new Error("Error verifying message");

      // update the state with the address and set loading to false
      setState((x) => ({ ...x, address, loading: false }));
    } catch (error) {
      setState((x) => ({ ...x, error, loading: false }));
    }
  },[address,activeChain]);

  React.useEffect(() => {
    const handler = async () => {
      try {
        const res = await fetch("/wagmi/me");
        const json = await res.json();
        console.log(json)
        setState((x) => ({ ...x, address: json.address }));
      } catch (error) {
        console.log(error);
      }
    };
    // 1. page loads
    handler();

    // 2. window is focused (in case user logs out of another window)
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, []);
 
  return (
    <WagmiContext.Provider
      value={{
        address: state.address,
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
        signIn,
        signOut,
        signInLoading: state.loading
      }}
    >
      {children}
    </WagmiContext.Provider>
  );
}
