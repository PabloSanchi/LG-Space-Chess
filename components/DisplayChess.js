import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useDocument } from 'react-firebase-hooks/firestore';
import { Chessboard } from "react-chessboard";
import { TailSpin } from "react-loader-spinner";
import { Chess } from "chess.js";
import toast, { Toaster } from 'react-hot-toast';
import Header from './Header';
import { useMediaQuery } from '@chakra-ui/react'
import { Stack, Box, HStack, Button, Text, Flex, VStack, Tag, Badge } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, doc } from "../firebase";
import { collection, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { io } from "socket.io-client";
import { useRouter } from 'next/router'

function DisplayChess() {

    // variable definition
    let soc = 'null';
    let [errorText,setErrorText] = useState('');
    const router = useRouter();
    const [socket, setSocket] = useState(null);
    const [conStat, setConStat] = useState('Disconnected');
    const [user, loadingUser] = useAuthState(auth); // user
    const [arrow, setArrow] = useState(null); // chessboard arrow
    const [isMobile] = useMediaQuery('(max-width: 560px)');
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    }) // responsive (affect chessboard only)

    // fetch chessboard status
    const [value, loading, error] = useDocument(
        doc(db, 'chess', 'ChessBoardStatus'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    // fetch the user doc (uid, displayName, lgrigip, vote limit, ...)
    const [userDoc, loadingUserDoc, errorUserDoc] = useDocument(
        doc(db, 'users', user.uid),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );
    
    // notifications
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
    }, [loadingUser, user.uid]);

    /*
    handle black pieces move when value().data.status changes
    */
    useEffect(() => {
        if (socket) { 
            socket.emit('newStatus', {
                status: value?.data()?.status,
                move: ''
            });
        }
    }, [value?.data()?.status]);

    /*
    handleConnect -> connect client with lgrig via WebSockets
    */
    const handleConnect = async () => {
        console.log('IP: ' + userDoc.data()?.lqrigip);
        setConStat('Loading...');
        try {
            setErrorText(`http://${userDoc.data()?.lqrigip}:8120`);
            soc = io(`http://${userDoc.data()?.lqrigip}:8120`, {
                'reconnect': false,
                'connect_timeout': 5000,
                // transports: ['websocket', 'polling', 'flashsocket'],
                query: "mobile=true"
            });

            // setErrorText(JSON.stringify(soc));

            setSocket(soc);

            soc.on("connect", () => {
                console.log('Cliente Conectado');
                console.log(soc.id);
                setConStat('Connected');
                soc.emit('currentBoard', {
                    status: value.data().status
                });
            });
        
            soc.on("connect_error", (err) => {
                console.log(`connect_error due to ${err.message}`);
                soc.disconnect();
                setConStat('Fail');
            });
          
        } catch (err) {
            notify('⚠️ Fatal Error: Refreshing');
            router.reload(window.location.pathname)
        }
    }

    const handleDisconnect = async() => {
        if (socket) { 
            socket.emit('quit');
            socket.disconnect();
            setConStat('Disconnected');
        }
    }

    /*
    sendInstruction -> send instruction to lgrig via WebSockets
    instruction: 
        - showDemo (demo of game chess)
        - showChess (show chessboard)
        - showEarth (show earth illustration)
    */
    const sendInstruction = (instruction) => {
        if (socket) {
            console.log('emmiting: ' + instruction);
            socket.emit(instruction);
        }
    }

    /*
    sendMove -> set new camera offset to lgrig via WebSockets
        - only depth and axis control
    */
    const sendMove = (xVal, zVal) => {
        if (socket) {
            socket.emit('controllerMove', {
                x: xVal,
                z: zVal,
            });
        }
    }

    /* 
    onDrop modification
        we give some extra functions:
            - add move validation
            - save move in the database
    */
    async function onDrop(sourceSquare, targetSquare) {

        if (value.data()?.turn == 'b') {
            notify('⚠️ Wait for your turn');
            return false;
        }

        if (userDoc.data()?.limit <= 0) {
            notify('❌ Limit Reached: 3/3');
            setArrow([arrow[0], arrow[1]]);
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

        // send fen status to the rig (if connected):
        if(socket) {
            socket.emit('newStatus', {
                status: value.data().status, // game.fen().split(' ')[0], 
                move: (sourceSquare + ' ' + targetSquare)
            });
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
            vote: [sourceSquare, targetSquare],
            limit: userDoc.data().limit - 1,
        }).catch(() => {
            notify('❌ Error');
        });

        setArrow([sourceSquare, targetSquare]);

        return true;
    }

    /*
    responsive (useLayout is not asynchronous, is synchronous) 
    we use it so we wont have any misplaced components. 
    */
    useLayoutEffect(() => {
        function handleResize() {

            setTimeout(() => {
                // if (window.innerWidth > 340) { //375
                if (window.innerHeight > 550) { //375
                    setDimensions({
                        height: window.innerHeight,
                        width: window.innerWidth
                    })
                }
            }, 100);
        }

        window.addEventListener('resize', handleResize)
        return _ => {
            window.removeEventListener('resize', handleResize)
        }
    })

    return (
        <VStack h="calc(100vh-3.5rem)" w="100vw" position="absolute">
            <Header />
            <Flex direction="column">
                <Toaster />
                {error && <strong>Error: {JSON.stringify(error)}</strong>}
                {loading && <TailSpin type="Puff" color="#808080" height="100%" width="100%" />}

                {userDoc && value &&
                    <HStack>
                        <Tag m={1} w={100} variant='solid' colorScheme='teal' >Attempts: {userDoc.data()?.limit}</Tag>
                        <Button mt={10} m={1} w={20} size='sm' colorScheme='blue' onClick={handleConnect}>Connect</Button>
                        {conStat == 'Connected' &&
                            <Button mt={10} m={1} w={20} size='sm' colorScheme='red' onClick={handleDisconnect}>Quit</Button>
                        }
                    </HStack>
                }

                {userDoc && <Badge m={1} colorScheme='purple'> LGRig IP: {userDoc.data()?.lqrigip}</Badge>}
                {value && <Badge m={1} colorScheme={value.data()?.turn == 'w' ? "blue" : "yellow"}>
                    Turn: {value.data()?.turn == 'w' ? "Earth" : "Space"}</Badge>}
                {userDoc && value &&
                    <Chessboard
                        boardWidth={isMobile ? (dimensions.width - 20 > 560 ? 340 : dimensions.width - 20) : 560}
                        position={value.data().status}
                        onPieceDrop={onDrop}
                        customDropSquareStyle={{ boxShadow: 'inset 0 0 1px 6px rgba(255,200,100,0.75)' }}
                        animationDuration={500}
                        customArrows={arrow === null ? [] : [arrow]}
                        customBoardStyle={{ borderRadius: '10px', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5 ' }}
                    />
                }

                <Text m={1}></Text>
                {/* {userDoc && value && <Button mt={10} m={1} w={20} size='sm' colorScheme='blue' onClick={handleConnect}>Connect</Button>} */}

                {userDoc && value &&
                    <Text >Connection Status: {conStat}
                        <Button backgroundColor='white' m={1} w={3} h={3} isLoading={(conStat == 'Loading...')}>
                        </Button>
                    </Text>
                }

                <Text m={1}></Text>
                
                {/* LGRig Controller */}
                {conStat == 'Connected' && 
                    <HStack >
                        <Button mt={10} m={1} w={20} size='sm' colorScheme='blue' onClick={() => sendInstruction('showDemo')}>Demo</Button>
                        <Button mt={10} m={1} w={20} size='sm' colorScheme='orange' onClick={() => sendInstruction('showChess')}>Chess</Button>
                        <Button mt={10} m={1} w={20} size='sm' colorScheme='green' onClick={() => sendInstruction('showEarth')}>Earth</Button>
                    </HStack>
                }
                {conStat == 'Connected' && 
                    <VStack>
                        <Button mt={10} onClick={ () => sendMove(0,-50) }>&uarr;</Button>
                        <HStack >
                            <Button mr={5} onClick={ () => sendMove(50,0) }>&larr;</Button>
                            <Button ml={5} onClick={ () => sendMove(-50,0) }>&rarr;</Button>
                        </HStack>
                        <Button mt={10} onClick={ () => sendMove(0,50) }>&darr;</Button>
                    </VStack>
                }

                <Text m={5}></Text>
                
                {/* <Text>Error: {errorText}</Text> */}

                {/* <Text m={5}></Text> */}
            </Flex>
        </VStack>
    )
}

export default DisplayChess