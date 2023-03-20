import {Box, chakra, Flex, Stack, Text, VStack} from "@chakra-ui/react";
import {GuideCard} from "../../components/cards/guides/GuideCard";
import React from "react";
import {useLocation} from "react-router-dom";
import {Guide} from "../../adapter/api/__generated";

export const GuidesSearchResult = () => {

    const playerDetails = useLocation().state as Guide[];

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
                            Search Result
                        </Text>
                    </chakra.h1>

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
                    playerDetails != null ?
                        playerDetails.map((guide) => {
                            return <GuideCard key={guide.id} guide={guide} isPublic={true}/>
                        })
                        : null
                }
            </VStack>
        </Box>
    );
}