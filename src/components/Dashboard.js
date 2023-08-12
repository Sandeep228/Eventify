import React from "react";
import {
  Box,
  Text,
  HStack,
  Link,
  Icon,
  Button,
  Divider,
  Flex,
  Stack,
} from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { SiEventstore, SiAkamai } from "react-icons/si";
import User from "./User";

function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth0();

  const handleEvents = () => {
    navigate("/event");
  };

  const handleopen = () => {
    navigate("/form", {
      replace: true,
    });
  };

  return (
    <Box bg="#131316" w="100%" h="100vh">
      <Box
        h="70px"
        borderBottom="1px solid #363739"
        style={{ overflow: "hidden" }}
      >
        <Box px="24px" py="16px" marginLeft="80px" marginRight="80px">
          <HStack display="flex" justifyContent="space-between">
            <Box>
              <Icon as={SiEventstore} h={6} w={6} color="white" mr="8px" />
              <Text as="b" fontSize="3xl" color="white">
                Eventify
              </Text>
            </Box>
            <Button rightIcon={<Icon as={SiAkamai} />} onClick={handleEvents}>
              Coming Events
            </Button>
            <Button onClick={() => logout()}> Logout</Button>
          </HStack>
        </Box>
      </Box>
      <Flex>
        <Box w="20%" h="110vh" p={71} bg="blue.700">
          <Stack spacing={7}>
            <Link
              href="#"
              //  onClick={handleClick}
              color="teal.500"
              fontWeight="bold"
              _hover={{ textDecoration: "none" }}
              _focus={{ outline: "none" }}
              as="a"
              _notLast={{ mb: 2 }}
            >
              About Us
            </Link>
            <Link
              href="#"
              // onClick={handleClick1}
              color="teal"
              fontWeight="bold"
              _hover={{ textDecoration: "none" }}
              _focus={{ outline: "none" }}
              as="a"
              _notLast={{ mb: 2 }}
            >
              Contacts
            </Link>
            <Link
              href="#"
              color="teal"
              fontWeight="bold"
              _hover={{ textDecoration: "none" }}
              _focus={{ outline: "none" }}
              as="a"
              _notLast={{ mb: 2 }}
            >
              Services
            </Link>
            <Button onClick={handleopen}>Add Event</Button>
          </Stack>
        </Box>
        <Flex direction="column" w="90%" p={4} bg="red.100">
          <Stack spacing={4}>
            <User />
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Dashboard;
