import { Flex, Button, Text } from "@chakra-ui/react";

const CustomButton = ({ children, isLoading, onClick }) => {
  console.log(children);
  return (
    <Button
      isLoading={isLoading}
      height="50px"
      variantColor="blue"
      variant="outline"
      backgroundColor="white"
      mr={3}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default function WagmiSignIn({
 connectors,
 isLoading,
 pendingConnector,
 error,
 connect,
 isConnected,
 signIn,
}) {
  return (
    <div>
      <main>
        <h1 className="title">HighFy Me  {process.env.REACT_APP_TITLE}</h1>
        <Flex h="35vh" justify="center" alignItems="center" bg="#e5f4f1"></Flex>
        <Flex h="5vh" justify="center" alignItems="center" bg="#e5f4f1">
          <Text>Connect Wallet to Login or Sign Up</Text>
        </Flex>

        <Flex
          h="15vh"
          justify="center"
          alignItems="center"
          grow="10"
          bg="#e5f4f1"
        >
            {
                !isConnected ? (
                    <div>
                    {connectors.map((connector) => (
                      <CustomButton
                        disabled={!connector.ready}
                        key={connector.id}
                        onClick={() => connect({ connector })}
                        isLoading={isLoading}
                      >
                        {connector.name}
                        {!connector.ready && " (unsupported)"}
                        {isLoading &&
                          connector.id === pendingConnector?.id &&
                          " (connecting)"}
                      </CustomButton>
                    ))}
        
                    {error && <div style={{color: "red"}}>{error.message}</div>}
                  </div>
                ):(
                    <CustomButton
                    onClick={signIn}
                    isLoading={isLoading}
                  >
                        Sign-In with Ethereum
                  </CustomButton>
                    
                )
            }
        </Flex>
        <Flex h="45vh" justify="center" alignItems="center" bg="#e5f4f1"></Flex>
      </main>
    </div>
  );
}
