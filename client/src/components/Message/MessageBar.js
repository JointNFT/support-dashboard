import { Button, Input, Stack, ButtonGroup, IconButton } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AddIcon } from '@chakra-ui/icons';
import Compress from 'compress.js';

const MAX_FILE_SIZE = 1; // in MB
const MessageBar = (props) => {
  const [text, setInput] = useState("");

  const send = () => {
    if (text?.trim()) {
      props.onSendMessage(props?.userAddress, text);
      setInput("");
    };
  };

  const sendPhoto = ({ file, name}) => {
    props.onSendMessage(props?.userAddress, '', {file,name})
  };
  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      send();
    }
  };

//handle img file
const inputFileRef = React.useRef();
const openFolder = () => {
  inputFileRef.current.click();
}

const handleChangeFile = (e) => {
  const compress = new Compress();
  const images = [...e.target.files];
  const reader = new FileReader();
  if(images[0]) {
      reader.onload = (e) => {
          compress.compress(images, { size: MAX_FILE_SIZE}).then(results  => {
              const img1 = results[0]
              const base64str = img1.data
              const imgExt = img1.ext
              const compressedImg = Compress.convertBase64ToFile(base64str, imgExt) 
              return sendPhoto({ file: compressedImg, name: images[0].name});
          })
       }
       reader.readAsDataURL(images[0]);
  }          
} 
useEffect(() => {
  setInput('');
},[props?.userAddress]);

  return (
    <Stack mt="5" direction={"row"} spacing={3} width="100%">
      <Input
        variant="filled"
        placeholder="Type your message..."
        value={text}
        onKeyDown={handleKeypress}
        onChange={handleInput}
      />
      <ButtonGroup size="md" isAttached >
      <Button colorScheme="blue" onClick={send}>
        Send
      </Button>
        <IconButton aria-label="Add photo" colorScheme="blue" icon={<AddIcon />} onClick={openFolder} />
        <input type="file" hidden ref={inputFileRef} onChange={handleChangeFile} accept="image/*"/>
      </ButtonGroup>
 
    </Stack>
  );
};

export default MessageBar;
