import { Flex, Button, Text } from "@chakra-ui/react";



const CustomButton = ({children, isLoading, onClick}) => (
  <Button
  	isLoading={isLoading}
  	height='50px'
  	variantColor='blue'
  	variant='outline'
  	backgroundColor='white'
  	mr={3}
  	onClick={onClick}
  >
  	{children}
  </Button>
);

export default function SignIn ({web3DisplayMessage, web3Loading, web3Provider, connectHandler}) {
	return (
		<div>
	      <main>
	        <h1 className="title">HighFy Me </h1>
	        <Flex h='35vh' justify='center' alignItems='center' bg='#e5f4f1'></Flex>
	        <Flex h='5vh' justify='center' alignItems='center' bg='#e5f4f1'>
	        
	        		<Text>{web3DisplayMessage}</Text>
	        	
	        </Flex>
        	<Flex h='15vh' justify='center' alignItems='center' bg='#e5f4f1'>
		         (
		          <CustomButton isLoading={web3Loading} onClick={connectHandler}>
		            Connect Wallet
		          </CustomButton>
		        )
	        </Flex>
	        <Flex h='45vh' justify='center' alignItems='center' bg='#e5f4f1'></Flex>
	      </main>
		</div>
	);
}