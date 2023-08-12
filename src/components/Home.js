import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
// import Profile from "./Profile";
// import LoginButton from "./Login";
// import LogoutButton from "./Logout";
import { Box, Text, HStack, Link, Button } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import Back from "./Back";
import { useNavigate } from "react-router-dom";

const Home = () => {
  // const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const handleEvents = () => {
    navigate("/event");
  };

  return (
    <Box bg="#131316" w="100%" h="100vh">
      <Box h="70px" borderBottom="1px solid white">
        <Box px="24px" py="16px" marginLeft="80px" marginRight="80px">
          <HStack display="flex" justifyContent="space-between">
            <Box>
              <Text as="b" fontSize="3xl" color="white">
                Eventify
              </Text>
            </Box>
            <Button onClick={handleEvents}>Coming Events</Button>
          </HStack>
          <Back />
        </Box>
      </Box>
      {/* <Box bg="red">
              <Text>Sign In to Grafbase</Text>
            </Box> */}
    </Box>
  );
};

export default Home;

// <main className="container">
//   {isAuthenticated ? (
//     <div>
//       <Profile />

//       <LogoutButton />
//     </div>
//   ) : (
//     <>
//       <h1>Click Here To Login</h1>

//       <LoginButton />
//     </>
//   )}
// </main>
