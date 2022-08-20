import { ArrowUpIcon, InfoIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";

const SERVER = "https://dashboard.highfi.me";

const Tranasaction = () => {
  let [transactions, setTransactions] = useState([]);
  const toast = useToast();
  const inputRef = useRef(null);
  let [userAddress, setUserAddress] = useState(
    "0x5c146cd18fa53914580573c9b9604588529406ca"
  );
  let [contractAddresses, setContractAddresses] = useState(
    "0xad337077480134028b7c68af290e891ce28076eb"
  );
  let [chain, setChain] = useState("ftm");

  const handleUserAddresInput = (e) => {
    setUserAddress(e.target.value);
  };

  const handleContractAddressInput = (e) => {
    setContractAddresses(e.target.value);
  };

  const handleSelectInput = (e) => {
    setChain(e.target.value);
  };

  const send = (e) => {
    fetchTransactions(userAddress, contractAddresses, chain);
  };

  const fetchTransactions = async (userAddress, contractAddresses, chain) => {
    fetch(
      SERVER +
        "/transactions?userAddress=" +
        userAddress +
        "&contractAddresses=" +
        contractAddresses +
        "&chain=" +
        chain
    ).then(async (response) => {
      let data = await response.json();
      setTransactions(data.filteredTransactions);
      console.log(transactions);
    });
  };

  const copyHandler = (e) => {
    toast({
      title: "Copied.",
      description: "Text copied to clipboard.",
      status: "info",
      duration: 9000,
      isClosable: true,
    });
    var copyText = inputRef.current;

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.value);
  };

  const pasteHandler = (e) => {
    navigator.clipboard.readText().then((clipText) => {
      return (inputRef.current.value = clipText);
    });
  };

  return (
    <Box width="30%" mt="5">
      <Box bg="#fff" p="5">
        <Flex align={"center"} justifyContent="center" bg={"white"} mb="7">
          <Heading as="h6" size="md">
            Transactions
            <InfoIcon ml="2" color={"blue.100"} />
          </Heading>
          <Badge
            variant="outline"
            colorScheme="blue.100"
            alignItems={"center"}
            ml="auto"
          >
            <ArrowUpIcon fontSize={"md"} color="blue.200" />
          </Badge>
        </Flex>

        <Box bg="#fff">
          <Heading as="h6" size="sm" mb="4">
            Customer address
            <InfoIcon ml="2" color={"blue.100"} />
          </Heading>
          <Stack direction={"row"} bg="#fff">
            <Flex
              fontSize={"sm"}
              width={"20%"}
              alignItems="center"
              justifyContent={"center"}
              bg="gray.100"
              onClick={pasteHandler}
              cursor="pointer"
              _hover={{
                background: "gray.200",
              }}
            >
              Paste
            </Flex>
            <Input
              value={userAddress}
              width="60%"
              type="text"
              onChange={handleUserAddresInput}
              ref={inputRef}
            />
            <Flex
              fontSize={"sm"}
              width={"20%"}
              alignItems="center"
              justifyContent={"center"}
              bg="gray.100"
              onClick={copyHandler}
              cursor="pointer"
              _hover={{
                background: "gray.200",
              }}
            >
              Copy
            </Flex>
          </Stack>
        </Box>

        <Box bg="#fff" mt="5">
          <Heading as="h6" size="sm" mb="4">
            Chain
            <InfoIcon ml="2" color={"blue.100"} />
          </Heading>
          <Stack direction={"row"} bg="#fff">
            <Select placeholder="Select option" onChange={handleSelectInput}>
              <option value="option1">FATOM</option>
              <option value="option1">ETHERIUM</option>
            </Select>
          </Stack>
        </Box>

        <Stack
          spacing={4}
          direction="row"
          align="center"
          mt="5"
          justifyContent={"space-between"}
        >
          <Button
            colorScheme="teal"
            size="sm"
            p={"4"}
            fontSize="sm"
            onClick={send}
          >
            Fetch Transactions
          </Button>
          <Flex alignItems="center">
            <FormControl display="flex" alignItems="center" gap="5px">
              <Switch id="email-alerts" />
              <FormLabel htmlFor="email-alerts" mb="0" fontSize={"sm"}>
                Auto Fetch
              </FormLabel>
            </FormControl>
            <InfoIcon ml="2" color={"blue.100"} />
          </Flex>
        </Stack>
      </Box>

      <Box bg="#fff" p="3" mt="5">
        <Flex align={"center"} justifyContent="center" mb="2" bg={"white"}>
          <Heading as="h6" size="md">
            Fetched Transactions
            <InfoIcon ml="2" color={"blue.100"} />
          </Heading>
          <Badge
            variant="outline"
            colorScheme="blue.100"
            alignItems={"center"}
            ml="auto"
          >
            <ArrowUpIcon fontSize={"md"} color="blue.200" />
          </Badge>
        </Flex>
        <Stack>
          <Heading as="h6" size="sm" mt="4">
            Start by filling transaction details
            <InfoIcon ml="2" color={"blue.100"} />
          </Heading>
          <Text>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Possimus,
            aspernatur.
          </Text>
        </Stack>
      </Box>
    </Box>
  );
};

export default Tranasaction;
