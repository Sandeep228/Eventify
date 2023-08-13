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
  Image
} from "@chakra-ui/react";

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
    console.log("all data fetched---",result);
    setData(result);
  };

  const handleEventID=async(eventID)=>{
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
              id: eventID
            },
          }),
        }
      );
  
    const result = await response.json();
    if(result?.data?.eventDelete?.deletedId){
        console.log("deleted ",result)
    }else{
        console.log("could not delete")
    }
    fetchData()
  }

  const editEventID = (eventID) =>{
    const eventToEdit = data?.data?.user?.events?.edges?.find(({ node }) => node.id == eventID);
    setEditedEvent(eventToEdit ? { ...eventToEdit.node } : null);
    setIsEditModalOpen(true);
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const EventUpdate =`
  mutation EventUpdate($id: ID $name: String! $description: String! $theme:String $venue:String){
    eventUpdate(by: {id:$id}, input: {name:$name description:$description theme:$theme venue:$venue}){
      event {
        updatedAt
      }
    }
  }
  `;

  const saveEditedEvent = async () => {
    // Update event on server using editedEvent data
    // Perform the GraphQL mutation to update the event here
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
            venue: editedEvent.venue
          },
        }),
      }
    );

    const result = await response.json();
    if(result.data!=null){
      console.log("event submitted successfully");
      // Close the modal and refresh the data
    setIsEditModalOpen(false);
    fetchData();
    }else{
      console.log("error in saving event");
    }
  };

  return (
  <div>
    <Heading>My events</Heading>
    {data && (
         <Text>
         {data?.data?.user?.events?.edges?.map(({ node }) => (
           <Text color="red" key={node.id}>
             Event name: {node.name} 
             Event Description: {node.description} 
             Published AT:{node.createdAt}
             Evevnt Date: {node.eventDate}
             theme: {node.theme}
             eventUrl: {node.eventUrl}
             venue: {node.venue}
             <Button onClick={() => handleEventID(node.id)}>Delete</Button>
             <Button onClick={() => editEventID(node.id)}>Edit</Button>

           </Text>
         ))}
       </Text>
    )}
    {/* Modal for Editing Event */}
    {isEditModalOpen && editedEvent && (
  <div style={{backgroundColor:"pink"}}>
    <h2><i>** you can only edit few details of your event **</i></h2>
    <br />
    <form>
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
    </form>
    <Button onClick={saveEditedEvent}>Save</Button>
    <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
  </div>
)}
  </div>
  );
};

export default MyEvents;
