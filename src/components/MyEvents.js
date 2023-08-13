import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Heading, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { async } from "q";

const MyEvents = () => {
  const [data, setData] = useState();
  const { user, isAuthenticated, isLoading } = useAuth0();

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
                publishedAt
                eventDate
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
             <Button onClick={() => handleEventID(node.id)}>Delete</Button>
           </Text>
         ))}
       </Text>
    )}
  </div>
  );
};

export default MyEvents;
