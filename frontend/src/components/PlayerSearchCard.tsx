import {Heading, VStack} from "@chakra-ui/react";
import {PlayerSearch} from "./PlayerSearch";

export const PlayerSearchCard = () => {

    return (
        <VStack
            border={"1px"}
            borderColor={"#3f444e"}
            rounded={"lg"}
            p={2}
            height={'100%'}
        >
            <Heading as="h2" fontSize={"xl"} mb={2}> Search other pros</Heading>
            <PlayerSearch/>
        </VStack>
    );
}