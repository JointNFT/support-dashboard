import { Button, useToast } from "@chakra-ui/react"

function Toast() {
  const toast = useToast()
  return (
    <Button
      onClick={() =>
        toast({
          title: 'Account created.',
          description: "We've created your account for you.",
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      }
    >
      Copy
    </Button>
  )
}

export default Toast