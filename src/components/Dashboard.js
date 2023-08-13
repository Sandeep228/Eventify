import React, {useEffect} from "react";
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
import { SiEventstore, SiAkamai, SiUnderscoredotjs } from "react-icons/si";
import User from "./User";

function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth0();
  const { user, isAuthenticated, isLoading } = useAuth0();

  const handleEvents = () => {
    navigate("/event");
  };

  const handleopen = () => {
    navigate("/form", {
      replace: true,
    });
  };

  const GetUserQuery = `
  query User($email: Email!) {
    user(by: {email:$email }) {
      id
    }
  }
`;

 const userCreate = `
 mutation UserCreate($name: String! $email: Email! $profileUrl: URL!){
  userCreate(input: {name:$name email:$email profileUrl:$profileUrl}) {
    user {
      id
    }
  }
 }
 `;

  const getUserByEmailID = async(email) => {
    const response = await fetch(
      "https://eventify-main-pujaagarwal5263.grafbase.app/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTE3NzcyNjYsImlzcyI6ImdyYWZiYXNlIiwiYXVkIjoiMDFIN0pXR1gwUjVNN0ZQUjkzV1pNQUtGMzgiLCJqdGkiOiIwMUg3SldHWDhRNVlWTVc1RkI0RDJFQ1dTUiIsImVudiI6InByb2R1Y3Rpb24iLCJwdXJwb3NlIjoicHJvamVjdC1hcGkta2V5In0.CnKts9fBm59UJw5enBJIgrXAIhLqvK_CGchRa--qw-Y",
        },
        body: JSON.stringify({
          query: GetUserQuery,
          variables: {
            email: email,
          },
        }),
      }

    );

    const result = await response.json();
    return result.data?.user;
  }

  const postNewUser= async(user)=>{
    const username = user.name;
    const email = user.email;
    const profileUrl = user.picture;

    const response = await fetch(
      "https://eventify-main-pujaagarwal5263.grafbase.app/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTE3NzcyNjYsImlzcyI6ImdyYWZiYXNlIiwiYXVkIjoiMDFIN0pXR1gwUjVNN0ZQUjkzV1pNQUtGMzgiLCJqdGkiOiIwMUg3SldHWDhRNVlWTVc1RkI0RDJFQ1dTUiIsImVudiI6InByb2R1Y3Rpb24iLCJwdXJwb3NlIjoicHJvamVjdC1hcGkta2V5In0.CnKts9fBm59UJw5enBJIgrXAIhLqvK_CGchRa--qw-Y",
        },
        body: JSON.stringify({
          query: userCreate,
          variables: {
            name: username,
            email: email,
            profileUrl: profileUrl
          },
        }),
      }
    );

    const result = await response.json();
    return result;
  }

  useEffect(() => {
    const fetchData = async()=>{
      if (isAuthenticated && user !== undefined) {
        // Perform your actions here
        console.log("User is authenticated:", user);
        const hasUsers = await getUserByEmailID(user.email)
        console.log("has users --",hasUsers)
        if(hasUsers==null){
          const userPosted = await postNewUser(user);
          if(userPosted.data != null){
            console.log("user posted successfully");
          }else{
            console.log("could not post user",userPosted)
          }
        }
      }
    }
    fetchData();
  }, [isAuthenticated, user]);

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
