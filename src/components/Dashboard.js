import React, { useEffect } from "react";
import {
  Box,
  Text,
  HStack,
  Icon,
  Button,
  Flex,
  Stack,
  Heading,
} from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { SiEventstore, SiAkamai } from "react-icons/si";
import { TbTimelineEventPlus } from "react-icons/tb";
import { BsCalendar2EventFill } from "react-icons/bs";

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

  const getMyEvents = () => {
    navigate("/myevents", {
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

  const getUserByEmailID = async (email) => {
    const response = await fetch(
      "https://eventify-main-pujaagarwal5263.grafbase.app/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${process.env.REACT_APP_GRAFBASE_API}`,
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
  };

  const postNewUser = async (user) => {
    const username = user.name;
    const email = user.email;
    const profileUrl = user.picture;

    const response = await fetch(
      "https://eventify-main-pujaagarwal5263.grafbase.app/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${process.env.REACT_APP_GRAFBASE_API}`,
        },
        body: JSON.stringify({
          query: userCreate,
          variables: {
            name: username,
            email: email,
            profileUrl: profileUrl,
          },
        }),
      }
    );

    const result = await response.json();
    return result;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated && user !== undefined) {
        console.log("User is authenticated:", user);
        const hasUsers = await getUserByEmailID(user.email);
        console.log("has users --", hasUsers);
        if (hasUsers == null) {
          const userPosted = await postNewUser(user);
          if (userPosted.data != null) {
            console.log("user posted successfully");
          } else {
            console.log("could not post user", userPosted);
          }
        }
      }
    };
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
            <Button onClick={() => logout()}> Logout</Button>
          </HStack>
        </Box>
      </Box>
      <Flex>
        <Box
          w="20%"
          h="110vh"
          p={71}
          bg="gray.900"
          sx={{
            background: `
      linear-gradient(to bottom, rgba(49, 97, 73, 1) 0%, rgba(19, 19, 22, 1) 100%),
      radial-gradient(circle, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 70%)
    `,
          }}
        >
          <Stack spacing={7} mt={66}>
            <Box>
              <Heading size="xl" mb={2} color="white">
                Eventify
              </Heading>
              <Text color="white" fontSize={25}>
                Elevating Experiences, <br /> Amplifying Impact, <br />
                Guided by AI.
              </Text>
            </Box>

            <Button
              rightIcon={<Icon as={TbTimelineEventPlus} />}
              onClick={handleopen}
            >
              Add Event
            </Button>

            <Button
              rightIcon={<Icon as={BsCalendar2EventFill} />}
              onClick={getMyEvents}
            >
              My Events
            </Button>
            <Button rightIcon={<Icon as={SiAkamai} />} onClick={handleEvents}>
              Coming Events
            </Button>
          </Stack>
        </Box>
        <Flex direction="column" w="90%" p={4} bg="black">
          <Stack spacing={4}>
            <User />
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Dashboard;
