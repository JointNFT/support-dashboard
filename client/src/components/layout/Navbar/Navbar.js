import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { useContext} from "react";
import UserContext from "../../../contexts/user/UserContext";

import { Link as ReactLink, useNavigate } from "react-router-dom";
import WagmiContext from "../../../contexts/wagmi/WagmiContext";

export default function WithSubnavigation() {
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();
  const { organization, setOrganization } = useContext(UserContext);
  const { signOut } = useContext(WagmiContext)
  const resetOrganization = () => {
    setOrganization(null);
    navigate('/', {replace: true})
  }

  return (
    <Box width={"100%"} h="8vh">
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
        alignSelf="center"
        width="80%"
        mx="auto"
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex
          flex={{ base: 1 }}
          justify={{ base: "center", md: "start" }}
          align="center"
        >
          <img
            src="./heart.png"
            alt=""
            style={{ margin: "0 5px", height: "80%" }}
          />
          <img src="./lg.png" alt="" style={{ height: "80%" }} />
          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          <Menu>
            <MenuButton
              _hover={{ background: "#ebf8ff" }}
              bg={"transparent"}
              as={Button}
              _active={{ background: "#ebf8ff" }}
              rightIcon={<ChevronDownIcon />}
            >
              User
            </MenuButton>
            <MenuList>
              <MenuItem _hover={{ background: "#ebf8ff" }}>
                <Link
                  as={ReactLink}
                  style={{ textDecoration: "none", color: "#666" }}
                  to="/profile"
                >
                  Profile
                </Link>
              </MenuItem>
              <MenuItem _hover={{ background: "#ebf8ff" }} style={{ textDecoration: 'none', color: '#666' }} onClick={() => resetOrganization()}>
								Switch Organization
							</MenuItem>
              <MenuItem _hover={{ background: "#ebf8ff" }}>
                <Link
                  as={ReactLink}
                  style={{ textDecoration: "none", color: "#666" }}
                  to="/accessKeys"
                >
                  Settings
                </Link>
              </MenuItem>
              <MenuItem _hover={{ background: "#ebf8ff" }}>
                <Link
                  as={ReactLink}
                  style={{ textDecoration: "none", color: "#666" }}
                  to="/logout"
                  onClick={signOut}
                >
                  Logout
                </Link>
              </MenuItem>
            </MenuList>
          </Menu>
          {/*<Button
            as={'a'}
            fontSize={'sm'}
            fontWeight={400}
            variant={'link'}
            href={'#'}>
            Profile
          </Button>*/}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Link
                p={2}
                as={ReactLink}
                to={navItem.href ?? "#"}
                fontSize={"sm"}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
                {<ChevronDownIcon />}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Link
      as={ReactLink}
      to={href}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("#ebf8ff", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "#ebf8ff.400" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"ebf8ff.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();
  console.log('href', href)
  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} as={ReactLink} to={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const NAV_ITEMS = [
  {
    label: "Conversations",
    children: [
      {
        label: "All",
        href: "/conversations/all",
      },
      {
        label: "Assigned",
        href: "/conversations/me",
      },
      {
        label: "Prioritized",
        href: "/conversations/prioritized",
      },
      {
        label: "Closed",
        href: "/conversations/closed",
      },
    ],
  },
  {
    label: "Accounts",
    children: [
      {
        label: "Job Board",
        href: "#",
      },
      {
        label: "Freelance Projects",
        href: "#",
      },
    ],
  },
  {
    label: "Settings",
    href: "/accessKeys",
  },
];
