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

    const notify = (text) => toast(text);

    const [value, loading, error] = useDocument(
        doc(db, 'chess', 'ChessBoardStatus'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    // useEffect(() => {
    //     console.log('adjusting...')
    //     const size = [window.innerWidth, window.innerHeight]
    //     if (size[0] < 340)    
    //         setChessWidth(320);
    //     // document.body.style.zoom = "60%";
    //     else if(size[0] < 600)
    //         setChessWidth(350)
    //     else
    //         setChessWidth(560)
    //     // document.body.style.zoom = "100%";
    // },[]);

    // responsive adjustments (naive solution, but fast)
    useEffect(() => {
        // console.log({ base: true ? 50 : 2, sm: 0 });
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


    async function onDrop(sourceSquare, targetSquare) {

        const game = new Chess()
        let move = null;
        // console.log(value.data().status + ' w KQkq - 0 1');
        game.load(value.data().status + ' w - - 0 1');
        // console.log(game.fen());

        move = game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q",
        });

        // console.log(sourceSquare, targetSquare);
        // console.log(game.fen().split(' ')[0]);

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

    const [isMobile] = useMediaQuery('(max-width: 560px)');

    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    })

    // screen.orientation.lock('portrait');
    useLayoutEffect(() => {
        function handleResize() {
            setTimeout(() => {
                setDimensions({
                    height: window.innerHeight,
                    width: window.innerWidth
                })
            },100);
        }

        window.addEventListener('resize', handleResize)
        return _ => {
            window.removeEventListener('resize', handleResize)
        }
    })

    return (
        <VStack >
            <Header />
            <Flex direction="column">
                <Toaster />
                {error && <strong>Error: {JSON.stringify(error)}</strong>}
                {loading && <TailSpin type="Puff" color="#808080" height="100%" width="100%" />}
                {isMobile && <Text color="blue">Mobile</Text>}
                {!isMobile && <Text color="red">Not Mobile</Text>}
                {value &&
                    <Chessboard
                        boardWidth={isMobile ? (dimensions.width - 20 > 425 ? 350 : dimensions.width - 20) : 560}
                        position={value.data().status}
                        onPieceDrop={onDrop}
                        customDropSquareStyle={{ boxShadow: 'inset 0 0 1px 6px rgba(255,200,100,0.75)' }}
                        animationDuration={500}
                        customArrows={arrow === null ? [] : [arrow]}
                        customBoardStyle={{ borderRadius: '10px', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5 ' }}
                    />
                }
            </Flex>
            {/* <Footer w="100vw"/> */}
        </VStack>
    )
}

export default DisplayChess