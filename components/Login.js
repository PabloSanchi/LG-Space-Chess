// import React, {useEffect} from 'react'
// import { signInWithGoogle, auth, logout } from "../firebase";
// import { useAuthState } from 'react-firebase-hooks/auth';


// import { FcGoogle } from 'react-icons/fc';
// import { Box, Button, Center, Stack, Text } from '@chakra-ui/react';
// import { MdLogout } from 'react-icons/md';


// function Login() {

//     useEffect(() => {
//         document.body.style.zoom = "100%";
//     }, []);

//     const handleLogin = () => {
//         signInWithGoogle()
//     }

//     const handleSignOut = () => {
//         logout();
//     }

//     const [user] = useAuthState(auth);

//     return (

//         <Center h="100vh" p={8} bg="red.150">

//             <Stack bg="whiteAlpha.900" spacing={2} align={'center'} maxW={'md'} w={'full'} boxShadow="md" p={20}>

//                 <Text fontSize="xl">
//                     {user ? `Welcome ${user.displayName}` : 'Log in'}
//                 </Text>


//                 <Button w={'full'} variant={'outline'} leftIcon={<FcGoogle />} onClick={handleLogin} >
//                     <Center>
//                         <Text>Google auth</Text>
//                     </Center>
//                 </Button>


//                 <Button w={'full'} colorScheme={'messenger'} leftIcon={<MdLogout />} onClick={handleSignOut} >
//                     <Center>
//                         <Text>About</Text>
//                     </Center>
//                 </Button>

//             </Stack>

//         </Center>
//     )
// }

// export default Login
import React, { useEffect } from 'react'
import { signInWithGoogle, auth, logout } from "../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';


import { FcGoogle, AiOutlineTwitter } from 'react-icons/fc';
import {
    Box,
    Flex,
    Stack,
    Heading,
    Text,
    Container,
    Input,
    Button,
    SimpleGrid,
    Avatar,
    AvatarGroup,
    useBreakpointValue,
    Icon,
    Center,
} from '@chakra-ui/react';

const avatars = [
    {
        name: 'a',
        url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGxhbmV8ZW58MHx8MHx8&w=1000&q=80',
        
    },
    {
        name: 'b',
        url: 'https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fGJvYXR8ZW58MHx8MHx8&w=1000&q=80',
        
    },
    {
        name: 'c',
        url: 'https://i.pinimg.com/originals/42/63/2f/42632f4d48030c4b04bdeb2bbe00e313.jpg'
        
    },
    {
        name: 'd',
        url: 'https://i0.wp.com/hipertextual.com/wp-content/uploads/2015/07/wallpapers-de-windows-10.jpg?fit=1000%2C625&ssl=1'
    },
    {
        name: 'e',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YmVhY2glMjBsYW5kc2NhcGV8ZW58MHx8MHx8&w=1000&q=80',
    },
];

export default function Login() {

    useEffect(() => {
        document.body.style.zoom = "100%";
    }, []);

    const handleLogin = () => {
        signInWithGoogle()
    }

    return (
        <Box position={'relative'}>
            <Container
                as={SimpleGrid}
                maxW={'7xl'}
                columns={{ base: 1, md: 2 }}
                spacing={{ base: 10, lg: 32 }}
                py={{ base: 10, sm: 20, lg: 32 }}>
                <Stack spacing={{ base: 10, md: 20 }}>
                    <Heading
                        lineHeight={1.1}
                        fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}>
                        LG SPACE CHESS<br/>
                        <Text
                            as={'span'}
                            bgGradient="linear(to-r, red.700,pink.800)"
                            bgClip="text"
                            fontSize="20px"
                            >
                            Liquid Galaxy & Hydra-Space
                        </Text>{' '}
                        
                    </Heading>
                    <Stack direction={'row'} spacing={4} align={'center'}>
                        <AvatarGroup>
                            {avatars.map((avatar) => (
                                <Avatar
                                    key={avatar.name}
                                    name={avatar.name}
                                    src={avatar.url}
                                    size={useBreakpointValue({ base: 'md', md: 'lg' })}
                                    position={'relative'}
                                    zIndex={2}
                                    _before={{
                                        content: '""',
                                        width: 'full',
                                        height: 'full',
                                        rounded: 'full',
                                        transform: 'scale(1.125)',
                                        bgGradient: 'linear(to-bl, gray.200,gray.400)',
                                        position: 'absolute',
                                        zIndex: -1,
                                        top: 0,
                                        left: 0,
                                    }}
                                />
                            ))}
                        </AvatarGroup>
                        <Text fontFamily={'heading'} fontSize={{ base: '4xl', md: '6xl' }}>
                            +
                        </Text>
                        <Flex
                            align={'center'}
                            justify={'center'}
                            fontFamily={'heading'}
                            fontSize={{ base: 'sm', md: 'lg' }}
                            bg={'gray.800'}
                            color={'white'}
                            rounded={'full'}
                            width={useBreakpointValue({ base: '44px', md: '60px' })}
                            height={useBreakpointValue({ base: '44px', md: '60px' })}
                            position={'relative'}
                            _before={{
                                content: '""',
                                width: 'full',
                                height: 'full',
                                rounded: 'full',
                                transform: 'scale(1.125)',
                                bgGradient: 'linear(to-bl, orange.400,yellow.400)',
                                position: 'absolute',
                                zIndex: -1,
                                top: 0,
                                left: 0,
                            }}>
                            YOU
                        </Flex>
                    </Stack>
                </Stack>
                <Stack
                    bg={'gray.50'}
                    rounded={'xl'}
                    p={{ base: 4, sm: 6, md: 8 }}
                    spacing={{ base: 8 }}
                    maxW={{ lg: 'lg' }}>
                    <Stack spacing={4}>
                        <Heading
                            color={'gray.800'}
                            lineHeight={1.1}
                            fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
                            Join the chess community
                            <Text
                                as={'span'}
                                bgGradient="linear(to-r, red.700,pink.800)"
                                bgClip="text">
                                !
                            </Text>
                        </Heading>
                        <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }}>
                            This is the new way to play chess, but now, as a community.
                            Do not hesitate and share it on social media!!!
                        </Text>
                    </Stack>
                    <Box as={'form'} mt={10}>
                        <Stack spacing={4}>
                            <Button 
                                w={'full'} 
                                variant={'outline'}
                                leftIcon={<FcGoogle />} 
                                onClick={handleLogin}
                                color='white'
                                bgGradient="linear(to-r, purple.600,red.600)"
                                _hover={{
                                    color: 'white',
                                    bgGradient: 'linear(to-r, purple.500, red.500)',
                                    boxShadow: 'xl',
                                }}>
                                <Center>
                                    <Text>Google auth</Text>
                                </Center>
                            </Button>
                        </Stack>
                    </Box>
                    
                </Stack>
            </Container>
            <Blur
                position={'absolute'}
                top={-10}
                left={-10}
                style={{ filter: 'blur(70px)' }}
            />
        </Box>
    );
}

export const Blur = (props) => {
    return (
        <Icon
            width={useBreakpointValue({ base: '100%', md: '40vw', lg: '30vw' })}
            zIndex={useBreakpointValue({ base: -1, md: -1, lg: 0 })}
            height="560px"
            viewBox="0 0 528 560"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            {/* <circle cx="71" cy="61" r="111" fill="#FFFF65" /> */}
            <circle cx="71" cy="61" r="111" fill="gray" />
            <circle cx="244" cy="16" r="120" fill="gray" />
            <circle cx="80.5" cy="291" r="60" fill="gray" />
            {/* <circle cy="291" r="139" fill="#ED64A6" />
            <circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936" />
            <circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B" />
            <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" />
            <circle cx="426.5" cy="-0.5" r="101.5" fill="#4299E1" /> */}
        </Icon>
    );
};