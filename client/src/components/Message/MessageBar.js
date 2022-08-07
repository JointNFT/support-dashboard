import { Button, Input, Stack } from "@chakra-ui/react";
import React from "react";

const MessageBar = (props) => {

  return (
    <Stack mt="5" direction={"row"} spacing={3} width="100%">
      <Input
        variant="filled"
        placeholder="Type your message..."
        value={props.input}
        onKeyDown={props.handleKeypress}
        onChange={props.handleInput}
      />
      <Button colorScheme="blue" onClick={props.send}>Send</Button>
    </Stack>
  );
};

export default MessageBar;
