import React, { useEffect } from 'react'
import { signInWithGoogle, auth, logout } from "../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';


import { FcGoogle } from 'react-icons/fc';
import { Box, Button, Center, Stack, Text } from '@chakra-ui/react';
import { MdLogout } from 'react-icons/md';
import Head from 'next/head'


function about() {
    return (
        <div>
            <Head>
                <title>About</title>
                <meta name="description" content="" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Center>
                <Text>A Newspace related visualization project in collaboration with Hydra-Space.
                    The basic idea is to use the Liquid Galaxy cluster as a handler and visualizer of a world chess game
                    that will happen with people around the world and through satellite communications, a world's first !!!</Text>
            </Center>
        </div>
    )
}

export default about