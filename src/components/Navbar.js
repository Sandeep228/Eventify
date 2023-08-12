import React from 'react';
import {
    ChakraProvider,
    Button,
    Box,
    Text,
    Flex,
    HStack,
    VStack,
    Link,
  } from "@chakra-ui/react";
import Back from './Back';

const Navbar = () => {
  return (
    <Box h="70px" borderBottom="1px solid white">
    <Box px="24px" py="16px" marginLeft="80px" marginRight="80px">
      <HStack display="flex" justifyContent="space-between">
        <Box>
          <Text as="b" fontSize="3xl" color="white">
            Eventify
          </Text>
        </Box>

        <Link
          href="https://chakra-ui.com"
          isExternal
          color="white"
          // marginLeft="1090px"
        >
          Coming Events
        </Link>
      </HStack>
      <Back />
    </Box>
  </Box>
  )
}

export default Navbar