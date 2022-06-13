import React, { useState, useEffect } from 'react'
import { useDocument } from 'react-firebase-hooks/firestore';
import { db, doc } from "../firebase";
import { Chessboard } from "react-chessboard";
import { TailSpin } from "react-loader-spinner";
import { Chess } from "chess.js";
import toast, { Toaster } from 'react-hot-toast';
import Header from './Header';

import { Box, Button, Center, Stack, Text } from '@chakra-ui/react';

function DisplayChess() {

    // responsive adjustments (naive solution, but fast)
    useEffect(() => {
        const size = [window.innerWidth, window.innerHeight]
        console.log(size);
        if(size[0] < 600)
            document.body.style.zoom = "60%";
        else
            document.body.style.zoom = "100%";
    }, []);
    

    const [arrow, setArrow] = useState(null);
    const [last, setLast] = useState(null)

    const notify = (text) => toast(text);

    const [value, loading, error] = useDocument(
        doc(db, 'chess', 'ChessBoardStatus'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    function onDrop(sourceSquare, targetSquare) {
        console.log(arrow);

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
            console.log('Illegal move');
            notify('❌ Illegal Move: ' + targetSquare);
            setArrow(last);
            return false; // illegal move
        }
        notify('✅ Success: ' + targetSquare);

        setLast([sourceSquare, targetSquare]);
        setArrow([sourceSquare, targetSquare]);

        console.log('Legal');
        return true;
    }

    return (
        <div>
            <Header />
            <Center>
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
            </Center>
        </div>

    )
}

export default DisplayChess