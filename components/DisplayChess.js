import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useDocument } from 'react-firebase-hooks/firestore';
import { Chessboard } from "react-chessboard";
import { TailSpin } from "react-loader-spinner";
import { Chess } from "chess.js";
import toast, { Toaster } from 'react-hot-toast';
import Header from './Header';
import Footer from './Footer';
import { useMediaQuery } from '@chakra-ui/react'

import { Box, Container, Center, Text, Flex, Stack, VStack, useColorModeValue, Alert, AlertIcon, Badge } from '@chakra-ui/react';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, doc, rtdb } from "../firebase";
import { collection, query, where, getDocs, updateDoc, increment, setDoc, getDoc, FieldValue } from "firebase/firestore";


function DisplayChess() {

    const [user, loadingUser] = useAuthState(auth);
    const [arrow, setArrow] = useState(null);
    const [isMobile] = useMediaQuery('(max-width: 560px)');
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    })
    const [value, loading, error] = useDocument(
        doc(db, 'chess', 'ChessBoardStatus'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );
    const [ipTarget, loadingIp, errorIp] = useDocument(
        doc(db, 'users', user.uid),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const notify = (text) => toast(text);


    // fetch arrows (last user vote)
    useEffect(() => {
        console.log('loading arrows...');
        const getArrows = async () => {
            var val = null;
            try {

                while (loadingUser) { } // waiting for auth hook
                var el = await getDoc(doc(collection(db, "users"), user.uid));
                val = (el.data()?.vote ? el.data()?.vote : null);

                setArrow(val)
            } catch (err) { }
        }
        getArrows();
    }, []);

    // onDrop chessboard modification
    // we give some extra functions
    //  - add move validation
    //  - save move in the database
    async function onDrop(sourceSquare, targetSquare) {

        if (value.data().turn == 'b') {
            notify('⚠️ Wait for your turn');
            return false;
        }

        if (Array.isArray(arrow) && sourceSquare == arrow[0] && targetSquare == arrow[1]) {
            setArrow([sourceSquare, targetSquare]); // re-render the move
            return true; // exit the function
        }

        const game = new Chess() // create empty game
        let move = null;
        game.load(value.data().status + ' w - - 0 1'); // load current game status

        // make the move
        // return null if move is not allowed
        move = game.move({
            from: sourceSquare,
            to: targetSquare,
            // promotion: "q", // promote to queen (not used yet)
        });

        // illegal move
        if (move === null) {
            notify('❌ Illegal Move: ' + targetSquare);
            setArrow(arrow);
            return false; 
        }

        // legal move
        notify('✅ Success: ' + targetSquare);

        // update vote in the real time database
        // - quit the current vote if so   
        // - add the new vote or update it
        const docSnap = await getDoc(doc(db, "votes/dailyVote"));
        if (docSnap.exists()) {
            
            const value = docSnap.data();
            // if the user already has a vote
            // - decrement by one the move voted
            if (Array.isArray(arrow)) { 
                setDoc(doc(db, `votes/dailyVote`), {
                    [`${arrow[0]}_${arrow[1]}`]: (value[`${arrow[0]}_${arrow[1]}`] - 1),
                }, { merge: true });
            }
            // add new vote or update it
            if (value[`${sourceSquare}_${targetSquare}`]) {
                setDoc(doc(db, `votes/dailyVote`), {
                    [`${sourceSquare}_${targetSquare}`]: (value[`${sourceSquare}_${targetSquare}`] + 1),
                }, { merge: true });
            } else {
                setDoc(doc(db, `votes/dailyVote`), {
                    [`${sourceSquare}_${targetSquare}`]: 1,
                }, { merge: true });
            }
        }
        // update vote in the user ref
        updateDoc(doc(collection(db, "users"), user.uid), {
            vote: [sourceSquare, targetSquare]
        }).catch(() => {
            notify('❌ Error');
        });

        setArrow([sourceSquare, targetSquare]);

        return true;
    }

    // responsive (useLayout is not asynchronous, is synchronous) 
    // we use it so we wont have any misplaced components.
    useLayoutEffect(() => {
        function handleResize() {
            setTimeout(() => {
                setDimensions({
                    height: window.innerHeight,
                    width: window.innerWidth
                })
            }, 20);
        }

        window.addEventListener('resize', handleResize)
        return _ => {
            window.removeEventListener('resize', handleResize)
        }
    })

    return (
        <VStack h="calc(100vh)" w="100vw" position="absolute">
            <Header />
            <Flex direction="column" mb={10}>
                <Toaster />
                {error && <strong>Error: {JSON.stringify(error)}</strong>}
                {loading && <TailSpin type="Puff" color="#808080" height="100%" width="100%" />}
                {ipTarget && <Badge m={1} colorScheme='purple'> LGRig IP: {ipTarget.data().lqrigip}</Badge>}
                {value && <Badge m={1} colorScheme={value.data().turn == 'w' ? "blue" : "yellow"}>Turn: {value.data().turn == 'w' ? "Earth" : "Space"}</Badge>}
                {ipTarget && value &&
                    <Chessboard
                        boardWidth={isMobile ? (dimensions.width - 20 > 560 ? 350 : dimensions.width - 20) : 560}
                        position={value.data().status}
                        onPieceDrop={onDrop}
                        customDropSquareStyle={{ boxShadow: 'inset 0 0 1px 6px rgba(255,200,100,0.75)' }}
                        animationDuration={500}
                        customArrows={arrow === null ? [] : [arrow]}
                        customBoardStyle={{ borderRadius: '10px', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5 ' }}
                    />
                }
                <Text m={10}></Text>
            </Flex>

            {/* <Footer position="absolute" w="100%" height="2.5rem" bottom={0}/> */}
            <Box
                // screen.orientation.type
                mt={10}
                position="fixed"
                w="100%"
                height="3rem"
                bottom={0}
                bg={useColorModeValue('black', 'red.900')}
                color={useColorModeValue('white', 'gray.200')}>
                <Container
                    as={Stack}
                    maxW={'6xl'}
                    py={4}
                    direction={{ base: 'column', md: 'row' }}
                    spacing={4}
                    justify={{ base: 'center', md: 'space-between' }}
                    align={{ base: 'center', md: 'center' }}>
                    <Text>© 2022 Liquid Galaxy </Text>
                </Container>
            </Box>

        </VStack>
    )
}


export default DisplayChess