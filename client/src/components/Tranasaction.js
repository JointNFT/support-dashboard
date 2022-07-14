import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Select,
  Stack,
  Switch,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { InfoIcon, ArrowUpIcon } from "@chakra-ui/icons";

const SERVER = "https://dashboard.highfi.me";

const Tranasaction = () => {
  let [transactions, setTransactions] = useState([]);

  let [userAddress, setUserAddress] = useState("0x5c146cd18fa53914580573c9b9604588529406ca");
  let [contractAddresses, setContractAddresses] = useState("0xad337077480134028b7c68af290e891ce28076eb");
  let [chain, setChain] = useState("ftm");

  const handleUserAddresInput = (e) => {
      setUserAddress(e.target.value);
  };

  const handleContractAddressInput = (e) => {
      setContractAddresses(e.target.value);
  };

  const handleSelectInput = (e) => {
      setChain(e.target.value);
  }

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
            >
              Paste
            </Flex>
            <Input value={userAddress} width='60%' type='text' onChange={handleUserAddresInput} />
            {/*<Text fontSize={"lg"} width="60%" bg="#fff" p="3">
              0x64sfa561fsa3f21as3sfa213sa1f
            </Text>*/}
            <Flex
              fontSize={"sm"}
              width={"20%"}
              alignItems="center"
              justifyContent={"center"}
              bg="gray.100"
            >
              Copy
            </Flex>
          </Stack>
        </Box>

        <Box bg="#fff" mt="5">
          <Heading as="h6" size="sm" mb="4">
            Protocol
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
          <Button colorScheme="teal" size="sm" p={"4"} fontSize="sm" onClick={send}>
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
