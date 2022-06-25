import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useDocument, useCollection } from 'react-firebase-hooks/firestore';
import { Chessboard } from "react-chessboard";
import { TailSpin } from "react-loader-spinner";
import { Chess } from "chess.js";
import toast, { Toaster } from 'react-hot-toast';
import Header from './Header';
import Footer from './Footer';
import { useMediaQuery } from '@chakra-ui/react'

import { Box, Button, Center, VStack, Text, Flex } from '@chakra-ui/react';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, doc } from "../firebase";
import { collection, query, where, getDocs, updateDoc, increment, deleteField, setDoc, getDoc } from "firebase/firestore";

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

        if (move === null) {
            notify('❌ Illegal Move: ' + targetSquare);
            setArrow(arrow);
            return false; // illegal move
        }
        notify('✅ Success: ' + targetSquare);

        // update vote for the user
        updateDoc(doc(collection(db, "users"), user.uid), {
            vote: [sourceSquare, targetSquare]
        }).catch(() => {
            notify('❌ Error');
        });

        var key = game.fen().split(' ')[0];
        // get current value
        // var docSnap = await getDoc(doc(db, "vote", "dailyVote"));
        // var docu = docSnap.data().votes;
        // console.log(docu.key?.frec)
        // var frecuecy = [docSnap.data().votes.${key}.frec] ?? 0;
        var frecuecy = 1;

        console.log('la frecuencia es: ', frecuecy);

        await setDoc(doc(db, "vote", "dailyVote"), {
            votes: {
                ...value.data().votes,
                [`${key}`]: {
                    frec: frecuecy,
                    move: [sourceSquare, targetSquare],
                }
            }
        }, { merge: true });

        // gameStatus: game.fen().split(' ')[0],
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
            },20);
        }

        window.addEventListener('resize', handleResize)
        return _ => {
            window.removeEventListener('resize', handleResize)
        }
    })

    return (
        <VStack h="100vh">
            <Header />
            <Flex direction="column">
                <Toaster />
                {error && <strong>Error: {JSON.stringify(error)}</strong>}
                {loading && <TailSpin type="Puff" color="#808080" height="100%" width="100%" />}
                {isMobile && <Text color="blue">Mobile</Text>}
                {!isMobile && <Text color="red">Not Mobile</Text>}
                {ipTarget && <Text color="green"> Liquid Galaxy Master IP: {ipTarget.data().lqrigip}</Text>}
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
                
            </Flex>
            <Footer position="fixed" b={0} w="100vw"/>
        </VStack>
    )
}

export default DisplayChess