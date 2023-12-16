import {Box, chakra, Flex, HStack, IconButton, Modal, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useDisclosure, useToast, VStack} from "@chakra-ui/react";
import React, {useEffect} from "react";
import {GuideCard} from "../../components/cards/guides/GuideCard";
import {AddIcon, SearchIcon} from "@chakra-ui/icons";
import {useNavigate} from "react-router-dom";
import {GuideSearch} from "../../components/GuideSearch";
import {useApiClient} from "../../adapter/api/useApiClient";
import {useLoggedInUser} from "../../helper/useLoggedInUser";
import {Guide} from "../../adapter/api/__generated";


type GuidesHomeProps = {
    isPublic?: boolean;
}

export const GuidesHome = ({isPublic = false}: GuidesHomeProps) => {

    const toast = useToast();
    const navigate = useNavigate();
    const apiClient = useApiClient();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const {user} = useLoggedInUser();

    const [guides, setGuides] = React.useState<Guide[] | null>(
        null
    );

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                if (isPublic) {
                    setGuides(null);
                    const response = await apiClient.getGuides();
                    setGuides(response.data);
                } else {
                    const res = await apiClient.getGuidesUserguides(user?.id, {withCredentials: true});
                    setGuides(res.data);
                }
            } catch (e) {
                toast({
                    title: "Error",
                    description: "Something went wrong while getting guides",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }

        if (isPublic) {
            fetchGuides();
        }

        if (user !== null) {
            fetchGuides();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    /**
     * @name  navigateToGuidesNew
     * @brief called if the User wants to
     *        create a new guide
     */
    const navigateToGuidesNew = () => {

        if (isPublic) {
            toast({
                title: "Error",
                description: "You can't create a guide if you are not logged in",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } else {
            navigate('/guides/new'); // navigate to GuidesNew
        }
    }

    return (
        <Box px={8} py={16}>
            <Box
                w={{
                    base: "full",
                    md: 11 / 12,
                    xl: 9 / 12,
                }}
                mx="auto"
                textAlign={{
                    base: "left"
                }}
            >
                <Flex
                    alignItems={"center"}
                    justifyContent={"space-between"}
                >
                    <chakra.h1
                        mb={6}
                        fontSize={{
                            base: "4xl",
                            md: "6xl",
                        }}
                        fontWeight="bold"
                        lineHeight="none"
                        letterSpacing={{
                            base: "normal",
                            md: "tight",
                        }}
                        color="gray.900"
                        _dark={{
                            color: "gray.100",
                        }}
                    >
                        <Text
                            display={{
                                base: "block",
                                lg: "inline",
                            }}
                            w="full"
                            bgClip="text"
                            color={"#BE5A04"}
                            fontWeight="extrabold"
                        >
                            {isPublic ? "Public Guides" : "My Guides"}
                        </Text>
                    </chakra.h1>
                    <HStack>
                        {!isPublic ? null : <>
                            <IconButton size='lg'
                                        aria-label={"Search Guides"}
                                        icon={<SearchIcon/>}
                                        onClick={onOpen}
                            />
                            <Modal isOpen={isOpen} onClose={onClose}>
                                <ModalOverlay/>
                                <ModalContent>
                                    <ModalHeader>
                                        Search public guides
                                    </ModalHeader>
                                    <ModalCloseButton/>
                                    <ModalFooter>
                                        <GuideSearch/>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
                        </>
                        }
                        {isPublic ? null :
                            <IconButton border={"1px"}
                                        borderColor='#BE5A04'
                                        size='lg'
                                        aria-label={"Add Guide"}
                                        icon={<AddIcon/>}
                                        onClick={navigateToGuidesNew}

                            />
                        }
                    </HStack>
                </Flex>
                <Stack
                    direction={{
                        base: "column",
                        sm: "row",
                    }}
                    mb={{
                        base: 4,
                        md: 8,
                    }}
                    spacing={2}
                    justifyContent={{
                        sm: "left",
                        md: "center",
                    }}
                >
                </Stack>
            </Box>
            <VStack
                w={{
                    base: "full",
                    md: 11 / 12,
                    xl: 9 / 12,
                }}
                mx="auto"
                flexDirection="column"
                spacing={5}
            >
                {
                    guides != null ?
                        guides.map((guide) => {
                            return <GuideCard key={guide.id} guide={guide} isPublic={isPublic}/>
                        })
                        : null
                }
            </VStack>
        </Box>
    );
}