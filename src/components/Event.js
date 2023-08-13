import React, { useState, useEffect } from "react";
import { Box, Text, HStack, Icon, Heading } from "@chakra-ui/react";

import { SiEventstore, SiAkamai } from "react-icons/si";

function Event() {
  console.log("gf api",process.env.GRAFBASE_API)
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
            publishedAt
            eventDate
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
          "x-api-key":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTE3NzcyNjYsImlzcyI6ImdyYWZiYXNlIiwiYXVkIjoiMDFIN0pXR1gwUjVNN0ZQUjkzV1pNQUtGMzgiLCJqdGkiOiIwMUg3SldHWDhRNVlWTVc1RkI0RDJFQ1dTUiIsImVudiI6InByb2R1Y3Rpb24iLCJwdXJwb3NlIjoicHJvamVjdC1hcGkta2V5In0.CnKts9fBm59UJw5enBJIgrXAIhLqvK_CGchRa--qw-Y",
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
