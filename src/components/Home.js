import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  ChakraProvider,
  Box,
  Text,
  HStack,
  Icon,
  Button,
  Divider,
} from "@chakra-ui/react";
import { FaGoogle } from "react-icons/fa";
import { SiEventstore } from "react-icons/si";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  const handleEvents = () => {
    navigate("/event");
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile");
    }
  }, [isAuthenticated, navigate]);

  const handleAuth = async () => {
    await loginWithRedirect();
  };

  return (
    <ChakraProvider>
      <Box
        bg="#131316"
        w="100%"
        h="100vh"
        background="linear-gradient(to right, #020304, #0e2626, #316149) "
      >
        <Box
          h="70px"
          borderBottom="1px solid #363739"
          style={{ overflow: "hidden" }}
        >
          <Box px="24px" py="16px" marginLeft="80px" marginRight="80px">
            <HStack
              display="flex"
              justifyContent="space-between"
              position="sticky"
            >
              <Box>
                <Icon as={SiEventstore} h={6} w={6} color="white" mr="8px" />
                <Text onClick={handleAuth} as="b" fontSize="3xl" color="white">
                  Eventify
                </Text>
              </Box>
              <Button onClick={handleEvents} _hover={{ bg: "gray.300" }}>
                Coming Events
              </Button>
            </HStack>
          </Box>
        </Box>

        <Box px="24px" marginLeft="80px" marginRight="90px">
          <Box h={310} w={1232} marginTop="221px">
            <Text fontSize="5xl" color="white" marginLeft="470px" mb="6px">
              Sign In to <span fontSize="5xl">Eventify</span>
            </Text>

            <Divider w="369px" marginLeft="480px" borderColor="#363739" />
            <HStack marginLeft="550px" marginTop="32px">
              <Button
                size="lg"
                colorScheme="teal"
                variant="solid"
                bordeerRadius="xl"
                leftIcon={<Icon as={FaGoogle} />}
                onClick={handleAuth}
                style={{ boxShadow: "0px 2px 3px white" }}
              >
                Login with Gmail
              </Button>
            </HStack>
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default Home;
