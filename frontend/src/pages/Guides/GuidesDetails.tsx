import {useNavigate, useParams} from "react-router-dom";
import {Box, Button, chakra, Editable, EditableInput, EditablePreview, Heading, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast, VStack} from "@chakra-ui/react";
import React, {useEffect} from "react";
import {ContentState, EditorState} from 'draft-js';
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {DeleteIcon} from "@chakra-ui/icons";
import {useApiClient} from "../../adapter/api/useApiClient";
import {Guide} from "../../adapter/api/__generated";


type GuidesDetailsProps = {
    isPublic?: boolean;
}


export const GuidesDetails = ({isPublic = false}: GuidesDetailsProps) => {

    const navigate = useNavigate();
    const id = useParams().id;
    const [isEditMode, setIsEditMode] = React.useState(false);
    const [guide, setGuide] = React.useState<Guide | null>(null);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [editorState, setEditorState] = React.useState(
        () => EditorState.createEmpty(),
    );
    const api = useApiClient()
    const toast = useToast();

    /**
     * @name  navigateToGuidesHome
     * @brief navigate to overview page where all guides of the player are displayed
     */
    const navigateToGuidesHome = () => {
        navigate('/guides');
    }

    /**
     * @name  handleSaveButton
     * @brief called, when the User presses the Save/Edit-Button
     */
    const handleSaveButton = async () => {
        setIsEditMode(!isEditMode);

        if (isEditMode) {
            toast({
                title: 'Guide',
                status: 'success',
                description: "Successfully edited",
                duration: 3000,
                isClosable: true,
            })

            try {
                await api.putGuidesId(guide!.id!, {
                    title: guide!.title!,
                    text: editorState.getCurrentContent().getPlainText(),
                    userId: guide!.creator!.id!,
                });
                navigateToGuidesHome();
            } catch (e) {
                toast({
                    title: 'Guide',
                    status: 'error',
                    description: "Error: Something went wrong when editing Guide",
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    }

    //change text listener
    useEffect(() => {
        if (guide) {
            //set editor text
            setEditorState(EditorState.createWithContent(ContentState.createFromText(guide.text)))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [guide?.text]);


    useEffect(() => {
        const fetchGuide = async () => {
            try {
                const res = await api.getGuidesId(id!)
                setGuide(res.data);
            } catch (e) {
                toast({
                    title: "Error",
                    description: "Something went wrong while getting guide",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
        fetchGuide();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);


    /**
     * @name  deleteGuide
     * @brief called, when the User wants to delete the
     *        guide currently displayed on the page,
     *        deletes the guide from his list and
     *        navigates back to GuidesHome
     */
    const deleteGuide = async () => {
        // delete the guide currently displayed from database
        try {
            await api.deleteGuides(guide!.id!);
        } catch (e) {
            toast({
                title: "Error",
                description: "Something went wrong while deleting guide",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        navigateToGuidesHome();
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
                    <Editable
                        placeholder="New Guide"
                        border={isEditMode ? "1px" : "none"}
                        borderColor={"#3f444e"}
                        isDisabled={!isEditMode}
                        rounded={"lg"}
                        fontWeight="extrabold"
                        value={guide?.title}
                    >
                        <EditablePreview textColor={"#BE5A04"}/>
                        <EditableInput textColor={"#BE5A04"} onChange={(e) => {
                            setGuide({...guide!, title: e.target.value!})
                        }}/>
                    </Editable>
                </chakra.h1>
                <Heading>by {guide?.creator.userName}</Heading>
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
                alignItems={"start"}
            >
                <div/>
                <Box width={"100%"}>
                    <Editor editorState={editorState}
                            onEditorStateChange={setEditorState}
                            readOnly={!isEditMode}
                            toolbarStyle={{
                                border: "none",
                                borderRadius: "5px",
                                display: !isEditMode ? "none" : undefined,
                            }}
                            editorStyle={
                                {
                                    border: isEditMode ? "1px solid #3f444e" : "none",
                                    borderRadius: "15px",
                                }
                            }
                    />
                </Box>
                {isPublic ? null :
                    <>
                        <Box>
                            <IconButton

                                icon={<DeleteIcon/>}
                                aria-label="Delete Guides"
                                colorScheme="red"
                                onClick={onOpen}
                            />
                            <Button onClick={handleSaveButton} ml={5}>
                                {isEditMode ? "Save" : "Edit"}
                            </Button>
                        </Box>
                        <Modal isOpen={isOpen} onClose={onClose}>
                            <ModalOverlay/>
                            <ModalContent>
                                <ModalHeader>
                                    Delete Guide
                                </ModalHeader>
                                <ModalCloseButton/>
                                <ModalBody>
                                    Are you sure you want to delete this guide?
                                </ModalBody>
                                <ModalFooter>
                                    <Button colorScheme='red' mr={3} onClick={deleteGuide}>
                                        Yes
                                    </Button>
                                    <Button variant='ghost' onClick={onClose}>No</Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </>
                }
            </VStack>
        </Box>
    );
}