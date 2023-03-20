import {IconButton, Text, VStack} from "@chakra-ui/react";
import {AddIcon} from "@chakra-ui/icons";

/**
 * TODO: Finish function.
 * @constructor
 */
export const NewCard = () => {
    return (
        <>
            <VStack
                alignItems="center"
                justifyContent="center"
                height={'100%'}
                border={"1px"}
                borderColor={"#3f444e"}
                rounded="lg"
                p={2}
            >
                <IconButton aria-label={"newCard"} icon={<AddIcon/>} size="lg"/>
                <Text fontSize={"md"}>Add new card to the dashboard</Text>
            </VStack>
        </>
    );
}