import { useRouter } from 'next/router';
import { Box, Heading, Text, Button } from '@chakra-ui/react';

export default function NotFound() {
    
    const router = useRouter();
    
    return (
        <Box textAlign="center" py={10} px={6}>
            <Heading
                display="inline-block"
                as="h2"
                size="2xl"
                bgGradient="linear(to-r, red.300, red.600)"
                backgroundClip="text">
                404
            </Heading>
            <Text fontSize="18px" mt={3} mb={2}>
                Page Not Found
            </Text>
            <Text color={'gray.500'} mb={6}>
                The page you&Apos;re looking for does not seem to exist
            </Text>

            <Button
                colorScheme="teal"
                bgGradient="linear(to-r, red.300, red.400, red.600)"
                color="white"
                variant="solid"
                onClick={() => router.push('/')}>
                Go to Home
            </Button>
        </Box>
    );
}