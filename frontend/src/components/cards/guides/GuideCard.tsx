import {Box, Flex, Heading, Text} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import React from "react";
import {Guide} from "../../../adapter/api/__generated";


type GuideCardProps = {
    guide: Guide;
    isPublic?: boolean;
}


export const GuideCard = ({guide, isPublic = false}: GuideCardProps) => {

    const navigate = useNavigate();

    return (
        <>
            <Flex
                alignItems="center"
                justifyContent="center"
                width={["100%", "100%", "100%", "100%", "100%"]}
            >
                <Box
                    mx="auto"
                    px={8}
                    py={4}
                    rounded="lg"
                    shadow="lg"
                    bg="white"
                    _dark={{bg: "gray.800"}}
                    border={"1px"}
                    borderColor={"#3f444e"}
                    textAlign={"left"}
                    width={["100%", "100%", "100%", "100%", "100%"]}
                    _hover={{
                        transform: "scale(1.01)",
                        transition: "all 0.3s ease-in-out",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        isPublic ? navigate(`/public/guides/${guide.id}`) : navigate(`/guides/${guide.id}`)
                    }}
                >
                    <Box>
                        <Box display="flex" alignItems="baseline">
                            <Box
                                color="gray.500"
                                fontWeight="semibold"
                                letterSpacing="wide"
                                fontSize="xs"
                                textTransform="uppercase"
                            >
                                {guide.creator.userName}
                            </Box>
                        </Box>
                    </Box>
                    <Heading as={"h2"} fontSize="2xl" fontWeight="medium" mb={4}>{guide.title}</Heading>
                    <Box mt={2}>
                        <Text mt={2} color="gray.600" _dark={{color: "gray.300"}} noOfLines={2}>
                            {guide.text}
                        </Text>
                    </Box>
                    <Flex justifyContent="space-between" alignItems="center" mt={4}>
                        <Flex alignItems="center">
                        </Flex>
                    </Flex>
                </Box>
            </Flex>
        </>
    );

}