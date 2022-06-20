import React, { useState, useEffect, componentDidMount } from 'react'
import { useDocument, useCollection } from 'react-firebase-hooks/firestore';
import { Chessboard } from "react-chessboard";
import { TailSpin } from "react-loader-spinner";
import { Chess } from "chess.js";
import toast, { Toaster } from 'react-hot-toast';
import Header from './Header';
import Footer from './Footer';

import { Box, Button, Center, VStack, Text } from '@chakra-ui/react';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, doc } from "../firebase";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";

function DisplayChess() {

    const [user] = useAuthState(auth);
    const [arrow, setArrow] = useState(null);

    const notify = (text) => toast(text);

    const [value, loading, error] = useDocument(
        doc(db, 'chess', 'ChessBoardStatus'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );
    
    // responsive adjustments (naive solution, but fast)
    useEffect(() => {
        const size = [window.innerWidth, window.innerHeight]
        // console.log(size);
        if(size[0] < 600)
            document.body.style.zoom = "60%";
        else
            document.body.style.zoom = "100%";
    }, []);

    // get last saved movement
    useEffect(() =>  {
        const getArrows = async () => {
            var val = null;
            const q = query(collection(db, "users"), where("uid", "==", user.uid));
            const snap = await getDocs(q);
            snap.forEach((el) => {
                val = ( el.data()?.vote ? el.data()?.vote : null);
            });
            setArrow(val)
        }

        getArrows();        
    }, [arrow]);

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
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const snap = await getDocs(q);
        snap.forEach((el) => {
            updateDoc(doc(collection(db, "users"),el.id), {
                vote: [sourceSquare, targetSquare],
                gameStatus: game.fen().split(' ')[0],
            }).catch(() => {
                notify('❌ Error');
            });
        });

        setArrow([sourceSquare, targetSquare]);

        return true;
    }

    return (
        <div>
            <Header />
            {/* <Center h={`calc(100vh - ${adjustment}px)`} > */}
            {/* <VStack h="100%" w="100%"> */}
            <Center >
                <Toaster />
                {error && <strong>Error: {JSON.stringify(error)}</strong>}
                {loading && <TailSpin type="Puff" color="#808080" height="100%" width="100%" />}
                {value &&
                    <Chessboard
                        position={value.data().status}
                        onPieceDrop={onDrop}
                        customDropSquareStyle={{ boxShadow: 'inset 0 0 1px 6px rgba(255,200,100,0.75)' }}
                        animationDuration={500}
                        customArrows={arrow === null ? [] : [arrow]}
                    />
                }
                
                {/* <Footer /> */}

            </Center>
            
            
        </div>

    )
}

export default DisplayChess