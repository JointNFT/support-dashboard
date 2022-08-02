import {
  ArrowUpIcon,
  InfoIcon,
  ArrowDownIcon,
  ExternalLinkIcon,
  CheckCircleIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import {
  Link,
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
  useToast,
  Tag,
  TagLabel,
  TagLeftIcon,
  Divider,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { format } from "timeago.js";
import { SERVER } from "../config";
import loader from "../loader.svg";

const initState = {
  userAddress: "",
  contractAddresses: process.env.REACT_APP_DEFAULT_CONTRACT_ADDRESS,
  chain: "ftm",
};
const TRANSACTION_STATUS = {
  NEWEST: "Newest",
  PENDING: "Pending",
  OLDEST: "Oldest",
};
const TransactionStatusTab = ({ title, active, onClick }) => {
  return (
    <Button
      size="xs"
      variant={active ? "solid" : "ghost"}
      bg={active && "blue.100"}
      onClick={onClick}
    >
      {title}
    </Button>
  );
};

const TransactionItem = ({ item }) => {
  const date = new Date(parseInt(item?.timeStamp));
  const isPending = item?.txreceipt_status === "0";
  return (
    <Box p={1}>
      <Box p={3}>
        <div style={{ fontSize: 12, color: "#718096" }}>{`${format(
          date
        )} (${date.toLocaleString()})`}</div>
        <div
          style={{
            fontSize: 12,
            color: "#2D3748",
            fontWeight: 500,
            marginBottom: 12,
          }}
        >
          {item?.to}
        </div>
        <Flex align={"center"} justifyContent="space-between">
          <Button bg="blue.50" size={"sm"}>
            <Link href={`https://ftmscan.com/tx/${item?.hash}`} target="_blank">
              <ExternalLinkIcon fontSize={"md"} color="blue.700" />
            </Link>
          </Button>
          <Flex gap={2}>
            {isPending && (
              <Tag bg="yellow.200" size="sm" color="yellow.900">
                Pending
              </Tag>
            )}
            <Tag
              bg={isPending ? "yellow.500" : "green.500"}
              size="sm"
              variant="solid"
            >
              <TagLeftIcon
                boxSize="12px"
                as={isPending ? TimeIcon : CheckCircleIcon}
                color="whiteAlpha.900"
              />
              <TagLabel>{item?.gas}</TagLabel>
            </Tag>
          </Flex>
        </Flex>
      </Box>
      <Divider bg="gray.100" />
    </Box>
  );
};
const sortTransactions = (transactions, mode) => {
  let result = transactions ? [...transactions] : [];
  switch (mode) {
    case TRANSACTION_STATUS.NEWEST:
      result = result?.sort(
        (a, b) => parseInt(b.timeStamp) - parseInt(a.timeStamp)
      );
      break;
    case TRANSACTION_STATUS.PENDING:
      result = result?.filter((t) => t.txreceipt_status === "0");
      break;
    case TRANSACTION_STATUS.OLDEST:
      result = result?.sort(
        (a, b) => parseInt(a.timeStamp) - parseInt(b.timeStamp)
      );
      break;
    default:
      return result;
  }
  return result;
};
const Transaction = ({ userAddress }) => {
  const [transactions, setTransactions] = useState();
  const [sortedTransactions, setSortedTransactions] = useState();

  const [mode, setMode] = useState(TRANSACTION_STATUS.NEWEST);
  const [autoFetch, setAutoFetch] = useState(false);

  const toast = useToast();
  const inputRef = useRef(null);
  const transactionRef = useRef(null);
  const fetchedTransactionsRef = useRef(null);

  const [state, setState] = useState({ ...initState });
  const [isFetching, setIsFetching] = useState(false);
  const [showTransaction, setShowTransaction] = useState(true);
  const [showFetchedTransactions, setShowFetchedTransactions] = useState(false);

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const send = () => {
    fetchTransactions(state);
  };

  const fetchTransactions = async (state) => {
    setIsFetching(true);
    fetch(
      SERVER +
        `/transactions?${
          state.userAddress?.trim() &&
          "userAddress=" + state.userAddress?.trim() + "&"
        }` +
        `${
          state.contractAddresses?.trim() &&
          "contractAddresses=" + state.contractAddresses?.trim() + "&"
        }` +
        `${state.chain && "chain=" + state.chain}`
    ).then(async (response) => {
      let data = await response.json();
      if (data?.error) {
        toast({
          title: "Fetch transactions failed",
          description: data.error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        const transactions = data?.filteredTransactions;
        setTransactions(transactions);
      }
      setIsFetching(false);
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

  const handleChangeTransactionsMode = React.useCallback((value) => {
    setMode(value);
  }, []);

  React.useEffect(() => {
    if (window?.autoFetch) {
      fetchTransactions({ ...initState, userAddress });
    } else {
      setTransactions();
    }

    setState({ ...initState, userAddress });
  }, [userAddress]);

  React.useEffect(() => {
    setSortedTransactions(sortTransactions(transactions, mode));
  }, [mode, transactions]);

  const toggleAutoFetch = (e) => {
    setAutoFetch(e.target.checked);
    window.autoFetch = e.target.checked;
  };

  // Handle maxHeight of fetchedTransaction dropdown box
  const currentTransactionBottom =
    transactionRef.current?.getBoundingClientRect()?.bottom;
  const fetchedTransactionTop =
    fetchedTransactionsRef.current?.getBoundingClientRect()?.top;
  const [maxHeight, setMaxHeight] = useState("");
  React.useEffect(() => {
    if (showFetchedTransactions && showTransaction) {
      setMaxHeight(`calc(100vh - ${currentTransactionBottom}px - 150px)`);
    } else {
      setMaxHeight(`calc(100vh - ${fetchedTransactionTop}px - 150px)`);
    }
  }, [
    fetchedTransactionTop,
    currentTransactionBottom,
    showTransaction,
    showFetchedTransactions,
  ]);

  return (
    <Box width="30%" mt="5">
      <Box bg="#fff" p="5" ref={transactionRef}>
        <Flex align={"center"} justifyContent="center" bg={"white"}>
          <Heading as="h6" size="md">
            Transactions
            <InfoIcon ml="2" color={"blue.100"} />
          </Heading>
          <Button
            variant="outline"
            alignItems={"center"}
            ml="auto"
            onClick={() => setShowTransaction((o) => !o)}
          >
            {showTransaction ? (
              <ArrowUpIcon fontSize={"md"} color="blue.200" />
            ) : (
              <ArrowDownIcon fontSize={"md"} color="blue.200" />
            )}
          </Button>
        </Flex>
        <div style={{ display: showTransaction ? "" : "none" }}>
          <Box bg="#fff" mt="7">
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
                name="userAddress"
                value={state.userAddress}
                width="60%"
                type="text"
                onChange={handleChange}
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
              Contract Address
              <InfoIcon ml="2" color={"blue.100"} />
            </Heading>
            <Stack direction={"row"} bg="#fff">
              <Input
                name="contractAddresses"
                value={state.contractAddresses}
                width="100%"
                type="text"
                onChange={handleChange}
              />
            </Stack>
          </Box>
          <Box bg="#fff" mt="5">
            <Heading as="h6" size="sm" mb="4">
              Protocol
              <InfoIcon ml="2" color={"blue.100"} />
            </Heading>
            <Stack direction={"row"} bg="#fff">
              <Select
                placeholder="Select option"
                onChange={handleChange}
                value={state.chain}
                name="chain"
              >
                <option value="ftm">FATOM</option>
                <option value="eth">ETHERIUM</option>
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
                <Switch
                  id="email-alerts"
                  isChecked={autoFetch}
                  onChange={toggleAutoFetch}
                />
                <FormLabel htmlFor="email-alerts" mb="0" fontSize={"sm"}>
                  Auto Fetch
                </FormLabel>
              </FormControl>
              <InfoIcon ml="2" color={"blue.100"} />
            </Flex>
          </Stack>
        </div>
      </Box>

      <Box bg="#fff" p="5" mt="5" ref={fetchedTransactionsRef}>
        <Flex align={"center"} justifyContent="center" mb="2" bg={"white"}>
          <Heading as="h6" size="md">
            Fetched Transactions
            <InfoIcon ml="2" color={"blue.100"} />
          </Heading>
          <Button
            variant="outline"
            alignItems={"center"}
            ml="auto"
            onClick={() => setShowFetchedTransactions((o) => !o)}
          >
            {showFetchedTransactions ? (
              <ArrowUpIcon fontSize={"md"} color="blue.200" />
            ) : (
              <ArrowDownIcon fontSize={"md"} color="blue.200" />
            )}
          </Button>
        </Flex>
        <div style={{ display: showFetchedTransactions ? "" : "none" }}>
          <Stack>
            {!transactions ? (
              <Heading as="h6" size="sm" mt="4">
                Start by filling transaction details
                <InfoIcon ml="2" color={"blue.100"} />
              </Heading>
            ) : (
              <Flex
                justifyContent={"flex-start"}
                align={"center"}
                gap={"2"}
                mb={"2"}
              >
                {Object.values(TRANSACTION_STATUS).map((k) => (
                  <TransactionStatusTab
                    key={k}
                    title={k}
                    active={mode === k}
                    onClick={() => handleChangeTransactionsMode(k)}
                  />
                ))}
              </Flex>
            )}
          </Stack>
          <div style={{ overflow: "auto", maxHeight }}>
            {isFetching ? (
              <Flex direction="column" align="center" justifyContent="center">
                <Flex
                  direction="column"
                  align="center"
                  justifyContent="center"
                  bg="blue.50"
                  style={{ width: 56, height: 56, borderRadius: "50%", marginTop: 50,marginBottom: 50 }}
                >
                  <img
                    src={loader}
                    className="rotate"
                    width={30}
                    height={22}
                    style={{marginTop: 47}}
                  />
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 12,
                      color: "#2A4365",
                      marginTop: 30,
                    }}
                  >
                    Fetching...
                  </div>
                </Flex>
              </Flex>
            ) : (
              sortedTransactions?.map((t) => <TransactionItem item={t} />)
            )}
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default Transaction;
