import React from 'react';
import {Box, Center, Divider, Heading, Link, Stack, Text} from '@chakra-ui/react';
import {InputForm} from './components/InputForm';

export default function Homepage() {
    return (
        <Box minH="100vh" display="flex" flexDirection="column">
            <Box flex="1" p={4}>
                <Heading as="h3" size="xl" m="3% 0% 2% 0%">
                    Shortify
                </Heading>
                <InputForm/>
            </Box>
            <Box as="footer" role="contentinfo" mt="auto" p={4}>
                <Divider/>
                <Center>
                    <Stack direction="row" spacing="4" align="center">
                        <Text>&copy; {new Date().getFullYear()} Slim Ben Ammar. All rights reserved.</Text>
                        <Link href="https://www.linkedin.com/in/slim-ben-ammar" isExternal>
                            LinkedIn
                        </Link>
                        <Link href="https://github.com/BenAmmarSlim" isExternal>
                            GitHub
                        </Link>
                    </Stack>
                </Center>
            </Box>
        </Box>
    );
}