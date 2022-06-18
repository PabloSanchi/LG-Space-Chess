import { useState, useRef } from 'react';
import { Flex, Box, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Button, ButtonGroup } from '@chakra-ui/react'

import { auth, logout, db } from "../firebase";
import { collection, query, where, getDocs, set, updateDoc, setDoc, doc } from "firebase/firestore";

import { useAuthState } from 'react-firebase-hooks/auth';
import Link from "next/link";
import { useRouter } from 'next/router';

import toast, { Toaster } from 'react-hot-toast';
import { isIPV4Address } from "ip-address-validator";

const MenuItem = ({ children, isLast, to = '/', toDo }) => {

    return (
        <Button
            color="red.800"
            backgroundColor="white"
            width="100%"
            mb={{ base: isLast ? 0 : 2, sm: 0 }}
            mr={{ base: 0, sm: isLast ? 0 : 3 }}
            display="block"
            onClick={toDo}
        >
            <Link href={to}>{children}</Link>
        </Button>

    );
};


const Header = (props) => {

    // we do not use useState so it wont refresh the page (it will quit the modal!)
    var lqIp = ""; 

    const router = useRouter();
    const [user] = useAuthState(auth);
    const [show, setShow] = useState(false);
    const toggleMenu = () => setShow(!show);

    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = useRef(null)
    const finalRef = useRef(null)

    const notify = (text) => toast(text);

    const handleSignOut = () => {
        router.push('/');
        logout();
    }

    const handleSaveIp = async () => {
        if(!isIPV4Address(lqIp)) {
            notify('❌ Invalid IP Address');
            return;
        }

        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const snap = await getDocs(q);
        snap.forEach((el) => {
            updateDoc(doc(collection(db, "users"),el.id), {
                lqrigip: lqIp,
            }).then(() => {
                notify('✅ IP ADDED ');
            }).catch(() => {
                notify('❌ Retry');
            });
        });
        onClose();
    }

    const GetModal = () => {
        return (
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>LG Rig Modal</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Enter LGRig IP</FormLabel>
                            <Input ref={initialRef} placeholder='192.168.0.1' onChange={(e) => lqIp = e.target.value} />
                        </FormControl>

                    </ModalBody>

                    <ModalFooter>
                        <Button color="white" backgroundColor='red.700' mr={3} onClick={handleSaveIp}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        )
    }

    return (
        <Flex
            color='white'
            backgroundColor='red.700'
            mb={8}
            p={8}
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            w="100%"
        >
            <Toaster />
            <Box w="255">
                <Text fontSize="lg" fontWeight="bold" noOfLines={1}>
                    LG SPACE CHESS
                </Text>
                <Text>{user?.email ? user.displayName : JSON.stringify(user)}</Text>
            </Box>

            <Box display={{ base: 'block', md: 'none' }} onClick={toggleMenu}>
                {show ? <CloseIcon w={3} h={8} /> : <HamburgerIcon w={5} h={10} />}
            </Box>

            <Box display={{ base: show ? 'block' : 'none', md: 'block' }} flexBasis={{ base: '100%', md: 'auto' }} >
                <Flex
                    align="center"
                    justify={['center', 'space-between', 'flex-end', 'flex-end']}
                    direction={['column', 'row', 'row', 'row']}
                    pt={[4, 4, 0, 0]}
                >
                    <MenuItem todo={() => { }} to="/about">About</MenuItem>
                    <MenuItem todo={() => { }} to="/findsat">FindSat</MenuItem>
                    <MenuItem toDo={onOpen}>LQRig</MenuItem>
                    <MenuItem toDo={handleSignOut} isLast>SignOut</MenuItem>

                </Flex>
            </Box>

            <GetModal />
        </Flex>
    );

};

export default Header;

