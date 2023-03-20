import React from 'react';
import {Box, chakra, Stack, Text} from "@chakra-ui/react";
import {PlayerSearch} from "../components/PlayerSearch";
import {FeatureCard} from "../components/cards/FeatureCard";


export const LandingPage = () => {

    return (
        <Box px={8} py={24}>
            <Box
                w={{
                    base: "full",
                    md: 11 / 12,
                    xl: 9 / 12,
                }}
                mx="auto"
                textAlign={{
                    base: "left",
                    md: "center",
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
                        ProCollector
                    </Text>{" "}

                </chakra.h1>
                <chakra.p
                    px={{
                        base: 0,
                        lg: 24,
                    }}
                    mb={6}
                    fontSize={{
                        base: "lg",
                        md: "xl",
                    }}
                    color="gray.600"
                    _dark={{
                        color: "gray.300",
                    }}
                >
                    Be like your pro!
                </chakra.p>
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
            <Box
                w={{
                    base: "full",
                    md: 10 / 12,
                }}
                mx="auto"
                textAlign="center"
            >
                <PlayerSearch/>
                <FeatureCard/>
            </Box>
        </Box>
    );
}