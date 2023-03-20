import {
    Box,
    Button,
    chakra,
    Editable,
    EditableInput,
    EditablePreview,
    Heading,
    useToast,
    VStack
} from "@chakra-ui/react";
import {Editor} from "react-draft-wysiwyg";
import React from "react";
import {EditorState} from "draft-js";
import {useNavigate} from "react-router-dom";
import {useLoggedInUser} from "../../helper/useLoggedInUser";
import {useApiClient} from "../../adapter/api/useApiClient";

export const GuidesNew = () => {

    const {user} = useLoggedInUser();
    const apiClient = useApiClient();
    const navigate = useNavigate();
    const toast = useToast();

    /**
     * when the user presses "Edit", isEditMode is false
     * when the user presses "Save", isEditMode is true
     */
    const [isEditMode, setIsEditMode] = React.useState(true);
    const [title, setTitle] = React.useState("");
    const [editorState, setEditorState] = React.useState(
        () => EditorState.createEmpty(),
    );


    /**
     * Username
     */
    const username = user?.userName;

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
                description: "Successfully saved " + title,
                duration: 3000,
                isClosable: true,
            })

            try {
                await apiClient.postGuides({
                    title: title,
                    text: editorState.getCurrentContent().getPlainText(),
                    userId: user?.id!,
                });
                navigateToGuidesHome();
            } catch (e) {
                toast({
                    title: 'Guide',
                    status: 'error',
                    description: "Error: Something went wrong by saving Guide",
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    }

    /**
     * @name  navigateToGuidesHome
     * @brief navigates user to overview page where
     *        all guides of the player are displayed
     */
    const navigateToGuidesHome = () => {
        navigate('/guides');
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
                    >
                        <EditablePreview textColor={"#BE5A04"}/>
                        <EditableInput textColor={"#BE5A04"} onChange={(e) => setTitle(e.target.value)}/>
                    </Editable>
                </chakra.h1>
                <Heading>by {username}</Heading>
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
                            editorStyle={{
                                border: isEditMode ? "1px solid #3f444e" : "none",
                                borderRadius: "15px",
                            }}
                    />
                </Box>
                <Button onClick={handleSaveButton}>
                    {isEditMode ? "Save" : "Edit"}
                </Button>
            </VStack>
        </Box>
    );
}