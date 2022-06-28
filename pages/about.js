import React from 'react'
import { VStack, Text, Grid } from '@chakra-ui/react';
import Head from 'next/head'
import Header from '../components/Header';
import Image from 'next/image';
import LQlogo from '../public/logoLg.png';
import FirebaseIcon from '../public/firebaseLogo.png';
import Gsoc from '../public/logoGsoc.png';

function about() {
    return (
        <div>
            <Head>
                <title>About</title>
                <meta name="description" content="" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            <Header />

            <VStack>
                <Text p={10} >
                    A Newspace related visualization project in collaboration with Hydra-Space.
                    The basic idea is to use the Liquid Galaxy cluster as a handler and visualizer of a world chess game
                    that will happen with people around the world and through satellite communications, a world&apos;s first !!!
                </Text>
                <Grid p={10} templateColumns="repeat(2, 0.45fr)" gap={2}>
                    <Image  src={LQlogo}></Image>
                    <Image src={Gsoc}></Image>
                </Grid>
                <Text p={20} >
                    Two teams, the Earth (you) and the Space (a strong AI)
                    Every day the Earth makes one move, the most common move between you all, so play as a community and 
                    not as an individual.
                    <br /><br />
                    Once the Earth has made the move, wait for the Space.
                    The satellite has its own orbit so you may not see its move in hours, so be patient.
                </Text>
                <Image p={20} src={FirebaseIcon}></Image>
                
            </VStack>
        </div>
    )
}

export default about