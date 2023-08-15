import React, { useState, useEffect } from "react";
import { Box, Text, HStack, Icon, Heading } from "@chakra-ui/react";

import { SiEventstore, SiAkamai } from "react-icons/si";

function Event() {
  const [data, setData] = useState();

  const GetEventsQuery = `
    query EventCollection($first: Int!) {
      eventCollection(first: $first) {
        edges {
          node {
            id
            name
            theme
            description
            createdAt
            eventUrl
            eventDate
            venue
            host{
              name
            }
          }
        }
      }
    }
  `;
  const fetchData = async () => {
    const response = await fetch(
      "https://eventify-main-pujaagarwal5263.grafbase.app/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":`${process.env.REACT_APP_GRAFBASE_API}`
               },
        body: JSON.stringify({
          query: GetEventsQuery,
          variables: {
            first: 100,
          },
        }),
      }
    );

    const result = await response.json();
    console.log(result)
    setData(result);
  };

  console.log(data?.data?.eventCollection);

  useEffect(() => {
    fetchData();
  }, []);

  return (
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
          <HStack display="flex" justifyContent="space-between">
            <Box>
              <Icon as={SiEventstore} h={6} w={6} color="white" mr="8px" />
              <Text as="b" fontSize="3xl" color="white">
                Eventify
              </Text>
            </Box>
          </HStack>
        </Box>
      </Box>
      <Box color="white">
        <Heading>Event</Heading>
        <Text color="grey.300">
          {data && (
            <Text>
              {data?.data?.eventCollection?.edges?.map(({ node }) => (
                <Text color="red" key={node.id}>
                  Event name: {node.name} 
                  Event Description: {node.description} 
                  Published AT:{node.createdAt}
                  Evevnt Date: {node.eventDate}
                  theme: {node.theme}
                  Name: {node?.host?.name}
                  eventUrl: {node.eventUrl}
                  venue: {node.venue}
                  <p>-------</p>
                </Text>
              ))}
            </Text>
          )}
        </Text>
      </Box>
    </Box>
  );
}

export default Event;
