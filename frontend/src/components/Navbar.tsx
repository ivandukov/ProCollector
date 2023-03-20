import {
    Box,
    Button,
    chakra,
    CloseButton,
    Flex,
    HStack,
    IconButton,
    useColorModeValue,
    useDisclosure,
    VStack
} from "@chakra-ui/react";
import React from "react";
import {AiOutlineMenu} from "react-icons/all";
import {useNavigate} from "react-router-dom";

type NavbarProps = {
    loginState: boolean,
    setLoginState: (state: boolean) => void;
}

export const Navbar = ({loginState, setLoginState}: NavbarProps) => {

    const bg = useColorModeValue("white", "gray.800");
    const mobileNav = useDisclosure();
    const navigate = useNavigate();

    /**
     * Navbar handler for logged in and logged out users
     */
    const navItems = () => {
        if (loginState) {
            return (
                <>
                    <HStack spacing={4}>
                        <Button ml={10} variant={"link"} onClick={() => navigate("/public/guides")}>All Guides</Button>
                        <Button ml={10} variant={"link"} onClick={() => navigate("/dashboard")}>Dashboard</Button>
                        <Button variant={"link"} onClick={() => navigate("/guides")}>My Guides</Button>
                        <Button ml={10} variant={"link"} onClick={() => navigate("/settings")}>Settings</Button>
                        <Button colorScheme={"gray"} onClick={() => {
                            setLoginState(false);
                            sessionStorage.removeItem("user");
                            navigate("/");
                        }}>Logout</Button>
                    </HStack>
                </>
            );
        } else {
            return (
                <>
                    <Button ml={10} variant={"link"} onClick={() => navigate("/public/guides")}>All Guides</Button>
                    <HStack spacing={4}>
                        <Button colorScheme={"gray"} onClick={() => modalOpenEvent()}>Sign in / Register</Button>
                    </HStack>
                </>
            );
        }
    }


    const modalOpenEvent = () => {
        const event = new CustomEvent("loginregistermodal:open");
        document.dispatchEvent(event);
    }

    return (
        <>
            <chakra.header
                bg={bg}
                w="full"
                px={{
                    base: 2,
                    sm: 4,
                }}
                py={4}
                shadow="md"
            >
                <Flex alignItems="center" justifyContent="space-between" mx="auto">
                    <Flex>
                        <Button variant={"link"} fontSize="xl" fontWeight="medium" ml="2" onClick={() => {
                            loginState ? navigate("/dashboard") : navigate("/");
                        }}>
                            ProCollector
                        </Button>
                    </Flex>
                    <HStack display="flex" alignItems="center" spacing={1}>
                        <HStack
                            spacing={5}
                            mr={1}
                            color="brand.500"
                            display={{
                                base: "none",
                                md: "inline-flex",
                            }}
                        >
                            {
                                navItems()
                            }
                        </HStack>
                        <Box
                            display={{
                                base: "inline-flex",
                                md: "none",
                            }}
                        >
                            <IconButton
                                display={{
                                    base: "flex",
                                    md: "none",
                                }}
                                aria-label="Open menu"
                                fontSize="20px"
                                color="gray.800"
                                _dark={{
                                    color: "inherit",
                                }}
                                variant="ghost"
                                icon={<AiOutlineMenu/>}
                                onClick={mobileNav.onOpen}
                            />
                            <VStack
                                pos="absolute"
                                top={0}
                                left={0}
                                right={0}
                                display={mobileNav.isOpen ? "flex" : "none"}
                                flexDirection="column"
                                p={2}
                                pb={4}
                                m={2}
                                bg={bg}
                                spacing={3}
                                rounded="sm"
                                shadow="sm"
                            >
                                <CloseButton
                                    aria-label="Close menu"
                                    onClick={mobileNav.onClose}
                                />
                                {
                                    navItems()
                                }
                            </VStack>
                        </Box>
                    </HStack>
                </Flex>
            </chakra.header>
        </>
    );
}