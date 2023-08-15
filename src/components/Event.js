import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  HStack,
  Icon,
  Heading,
  Divider,
  Flex,
  Image,
  Button,
} from "@chakra-ui/react";

import { SiEventstore } from "react-icons/si";

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
          "x-api-key": `${process.env.REACT_APP_GRAFBASE_API}`,
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
    console.log(result);
    setData(result);
  };

  console.log(data?.data?.eventCollection);

  useEffect(() => {
    fetchData();
  }, []);

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <Box bg="black!important">
      <Box px="24px" py="16px" bg="#0e2323">
        <HStack display="flex" justifyContent="space-between" position="sticky">
          <Box>
            <Icon as={SiEventstore} h={6} w={6} color="white" mr="8px" />
            <Text as="b" fontSize="2xl" color="white">
              Eventify
            </Text>
          </Box>
          <Button onClick={handleGoBack}> Back to Home</Button>
        </HStack>
      </Box>
      <Box pl={100} bg="black">
        <Heading color="white" mt={2} mb={1} ml={490}>
          All UpComing Events
        </Heading>
        <Divider ml={490} w={360} />
        <Flex flexWrap="wrap">
          {data && (
            <>
              {data?.data?.eventCollection?.edges?.map(({ node }) => (
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
                  <Text>
                    Host name: <b>{node?.host?.name}</b>
                  </Text>
                  <Text mb={1}>
                    Description:<b>{node.description}</b>
                  </Text>
                  <Text mb={1}>
                    Theme: <b>{node.theme}</b>
                  </Text>
                  <Text mb={1}>
                    Venue: <b>{node.venue}</b>
                  </Text>
                  <Text mb={1}>
                    Event Date: <b>{node.eventDate}</b>
                  </Text>
                  <Text mb={1}>
                    Published AT: <b>{node.createdAt}</b>
                  </Text>
                </Box>
              ))}
            </>
          )}
        </Flex>
      </Box>
    </Box>
  );
}

export default Event;
