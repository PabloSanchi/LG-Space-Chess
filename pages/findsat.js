import React, {useEffect} from 'react'
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
            <title>SAT</title>
            <meta name="description" content="" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Text>FindSat</Text>
        </div>
      )
}

export default about