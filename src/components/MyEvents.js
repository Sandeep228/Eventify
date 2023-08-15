import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Text,
  Select,
  Image,
  Box,
  HStack,
  Flex,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Divider,
} from "@chakra-ui/react";
import { SiEventstore } from "react-icons/si";

const themes = [
  { value: "Education", label: "Education" },
  { value: "Environmet", label: "Environment" },
  { value: "Technology", label: "Technology" },
  { value: "StudentWelfare", label: "Student Welfare" },
];

const MyEvents = () => {
  const [data, setData] = useState();
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedEvent, setEditedEvent] = useState(null);

  useEffect(() => {
    fetchData();
  }, [isAuthenticated, user]);

  const handleGoBack = () => {
    window.history.back();
  };

  const GetEventsQuery = `
  query User($first: Int! $email:Email!) {
    user(by: {email:$email}) {
        events(first: $first) {
            edges {
              node {
                id
                name
                description
                createdAt
                eventUrl
                eventDate
                venue
                theme
              }
            }
          }
    }
  }
`;

  const DeleteEventsQuery = `
 mutation EventDelete($id: ID) {
    eventDelete(by: {id:$id}) {
      deletedId
    }
  }
 `;

  const fetchData = async () => {
    const email = user?.email;
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
          query: GetEventsQuery,
          variables: {
            first: 100,
            email: email,
          },
        }),
      }
    );

    const result = await response.json();
    setData(result);
  };

  const handleEventID = async (eventID) => {
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
          query: DeleteEventsQuery,
          variables: {
            id: eventID,
          },
        }),
      }
    );

    const result = await response.json();
    if (result?.data?.eventDelete?.deletedId) {
    } else {
      console.log("could not delete");
    }
    fetchData();
  };

  const editEventID = (eventID) => {
    const eventToEdit = data?.data?.user?.events?.edges?.find(
      ({ node }) => node.id == eventID
    );
    setEditedEvent(eventToEdit ? { ...eventToEdit.node } : null);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const EventUpdate = `
  mutation EventUpdate($id: ID $name: String! $description: String! $theme:String $venue:String){
    eventUpdate(by: {id:$id}, input: {name:$name description:$description theme:$theme venue:$venue}){
      event {
        updatedAt
      }
    }
  }
  `;

  const saveEditedEvent = async () => {
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
          query: EventUpdate,
          variables: {
            id: editedEvent.id,
            name: editedEvent.name,
            description: editedEvent.description,
            theme: editedEvent.theme,
            venue: editedEvent.venue,
          },
        }),
      }
    );

    const result = await response.json();
    if (result.data != null) {
      console.log("event submitted successfully");
      setIsEditModalOpen(false);
      fetchData();
    } else {
      console.log("error in saving event");
    }
  };

  return (
    <Box bg="black!important">
      <Box px="24px" py="16px" bg="#0e2323">
        <HStack display="flex" justifyContent="space-between" position="sticky">
          <Box>
            <Icon as={SiEventstore} h={6} w={6} color="white" mr="8px" />
            <Text as="b" fontSize="3xl" color="white">
              Eventify
            </Text>
          </Box>
          <Button onClick={handleGoBack}> Back to Home</Button>
        </HStack>
      </Box>
      <Box pl={100} bg="black">
        <Heading color="white" mt={2} mb={1} ml={490}>
          My Events
        </Heading>
        <Divider ml={490} w={180} />
        <Flex flexWrap="wrap">
          {data && (
            <>
              {data?.data?.user?.events?.edges?.map(({ node }) => (
                <Box
                  background="linear-gradient(to right,  #0e2626, #316149) "
                  key={node.id}
                  borderRadius="lg"
                  p={4}
                  m={2}
                  color="white"
                  width={{ base: "100%", sm: "45%", md: "30%" }}
                >
                  <Image
                    src={node.eventUrl}
                    alt="Event"
                    mb={2}
                    h={300}
                    w={379}
                  />
                  <Heading size="md" mb={2}>
                    {node.name}
                  </Heading>
                  <Text mb={2}> Description:{node.description}</Text>
                  <Text mb={1}>Event Date: {node.eventDate}</Text>
                  <Text mb={1}>Theme: {node.theme}</Text>
                  <Text mb={1}>Venue: {node.venue}</Text>
                  <Button onClick={() => editEventID(node.id)} mr={4}>
                    Edit
                  </Button>
                  <Button onClick={() => handleEventID(node.id)}>Delete</Button>
                </Box>
              ))}
            </>
          )}
        </Flex>
      </Box>

      {/* Modal for Editing Event */}
      {isEditModalOpen && editedEvent && (
        <EditEventModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          editedEvent={editedEvent}
          handleEditChange={handleEditChange}
          saveEditedEvent={saveEditedEvent}
          themes={themes}
        />
      )}
    </Box>
  );
};

const EditEventModal = ({
  isOpen,
  onClose,
  editedEvent,
  handleEditChange,
  saveEditedEvent,
  themes,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        sx={{
          background: "linear-gradient(to right,  #0e2626, #316149) ",
        }}
        color="white"
        boderRadius="xl"
      >
        <ModalHeader fontSize={34}>Edit Event</ModalHeader>
        <Text ml={26} color="red.600">
          Note: **you can only edit few details of your event **
        </Text>
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Name of Event</FormLabel>
            <Input
              type="text"
              name="name"
              value={editedEvent.name}
              onChange={handleEditChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Description</FormLabel>
            <Input
              type="text"
              name="description"
              value={editedEvent.description}
              onChange={handleEditChange}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Theme</FormLabel>
            <Select
              name="theme"
              value={editedEvent.theme}
              onChange={handleEditChange}
            >
              <option value="">Select a theme</option>
              {themes.map((theme) => (
                <option key={theme.value} value={theme.value}>
                  {theme.label}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Event Venue</FormLabel>
            <Input
              type="text"
              name="venue"
              value={editedEvent.venue}
              onChange={handleEditChange}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={saveEditedEvent} mr={4}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MyEvents;
