import React, {useEffect} from 'react'
import { signInWithGoogle, auth, logout } from "../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';


import { FcGoogle } from 'react-icons/fc';
import { Box, Button, Center, Stack, Text } from '@chakra-ui/react';
import { MdLogout } from 'react-icons/md';


function Login() {

    useEffect(() => {
        document.body.style.zoom = "100%";
    }, []);
    
    const handleLogin = () => {
        signInWithGoogle()
    }

    const handleSignOut = () => {
        logout();
    }

    const [user] = useAuthState(auth);

    return (

        <Center h="100vh" p={8} bg="red.150">
            
            <Stack bg="whiteAlpha.900" spacing={2} align={'center'} maxW={'md'} w={'full'} boxShadow="md" p={20}>
                
                <Text fontSize="xl">
                    {user ? `Welcome ${user.displayName}` : 'Log in'}
                </Text>

                
                <Button w={'full'} variant={'outline'} leftIcon={<FcGoogle />} onClick={handleLogin} >
                    <Center>
                        <Text>Google auth</Text>
                    </Center>
                </Button>

                
                <Button w={'full'} colorScheme={'messenger'} leftIcon={<MdLogout />} onClick={handleSignOut} >
                    <Center>
                        <Text>About</Text>
                    </Center>
                </Button>

            </Stack>

        </Center>
    )
}

export default Login