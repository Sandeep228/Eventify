import { React, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  ChakraProvider,
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  Flex,
  Stack,
  Link,
  Text,
  Icon,
  Heading,
  VStack,
  Container,
  Divider,
  Image,
} from "@chakra-ui/react";

const User = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [showEmail, setShowEmail] = useState(false);

  const toggleEmail = () => {
    setShowEmail(!showEmail);
  };

  return (
    <div className="profile-container">
      {isLoading && <div>Loading ...</div>}
      {isAuthenticated && (
        // <Box textAlign="center">
        //   <Image
        //     src={user?.picture}
        //     borderRadius="full"
        //     boxSize="150px"
        //     objectFit="cover"
        //     mx="auto"
        //   />
        //   <Text fontSize="xl" fontWeight="bold" my="2">
        //     {user?.name}
        //   </Text>
        //   <Text fontSize="md" color="gray.500">
        //     {showEmail ? user?.email : "Email hidden"}
        //   </Text>
        //   <Button mt="2" size="sm" onClick={toggleEmail}>
        //     {showEmail ? "Hide Email" : "Show Email"}
        //   </Button>
        //   <Box>
        //     <Text>
        //       Hi {user?.name} A warm and enthusiastic welcome to Eventify! We're
        //       absolutely delighted to have you join our community. As you step
        //       into the realm of Eventify, you're embarking on a journey filled
        //       with dynamic and transformative events. Get ready to unlock the
        //       power of connections, knowledge, and inspiration. Our AI-powered
        //       platform is your compass to navigate through a diverse array of
        //       events tailored to your interests. From captivating workshops to
        //       electrifying concerts, we've got it all lined up just for you. So,
        //       Sandeep, are you prepared to embrace this exhilarating experience?
        //       The stage is set, and the spotlight is on you. Let's embark on
        //       this eventful adventure together! Best regards, The Eventify Team
        //     </Text>
        //   </Box>
        // </Box>
        <Container
          maxW="container.md"
          py="8"
          sx={{
            background: "linear-gradient(to right,  #0e2626, #316149)",
            //  background: "linear-gradient(45deg, #FF0080, #7928CA)",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            color: "white",
          }}
        >
          <VStack spacing="4">
            <Image
              src={user?.picture}
              borderRadius="full"
              boxSize="150px"
              objectFit="cover"
            />

            <Text color="white" fontSize="md">
              {showEmail ? user?.email : "Email hidden"}
            </Text>
            <Button color="gray.600" size="sm" onClick={toggleEmail}>
              {showEmail ? "Hide Email" : "Show Email"}
            </Button>
          </VStack>
          <Divider my="8" />
          <Box textAlign="center">
            <Heading as="h2" size="lg" mb="4">
              Welcome to Eventify!
            </Heading>
            <Text fontSize="lg">
              A warm and enthusiastic welcome to Eventify! We're absolutely
              delighted to have you join our community. As you step into the
              realm of Eventify, you're embarking on a journey filled with
              dynamic and transformative events. Get ready to unlock the power
              of connections, knowledge, and inspiration. Our AI-powered
              platform is your compass to navigate through a diverse array of
              events tailored to your interests. From captivating workshops to
              electrifying concerts, we've got it all lined up just for you. So,{" "}
              <b>{user?.name}</b> ,are you prepared to embrace this exhilarating
              experience? The stage is set, and the spotlight is on you. Let's
              embark on this eventful adventure together!
            </Text>
            <Text color="white" mt="8" fontSize="sm">
              Best regards,
              <br />
              The Eventify Team
            </Text>
          </Box>
        </Container>
      )}
    </div>
  );
};

export default User;
