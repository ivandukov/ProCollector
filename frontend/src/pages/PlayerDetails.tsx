import {Box, chakra, Grid, GridItem, Spinner, Text, VStack} from "@chakra-ui/react";
import {RankCard} from "../components/cards/statistics/RankCard";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {PlayerSearchType} from "../components/PlayerSearch";
import {useApiClient} from "../adapter/api/useApiClient";
import {SummonerWithQueuesMatches} from "../adapter/api/__generated";
import {PlayerNameCard} from "../components/cards/PlayerNameCard";
import {GameTable} from "../components/cards/statistics/GameTable";
import {MainStatsCard} from "../components/cards/MainStatsCard";


export const PlayerDetails = () => {

    /*
    *  Player Details coming from router
    */
    const playerDetails = useLocation().state as PlayerSearchType;

    const [player, setPlayer] = useState<SummonerWithQueuesMatches | null>(null);
    const [error, setError] = useState<string | null>(null);
    const apiClient = useApiClient();

    useEffect(() => {
        setPlayer(null);
        setError(null);
        const fetchData = async () => {
            try {
                const response = await apiClient.riotApiGetSummonerByNameGet(playerDetails.region!, playerDetails.playerName);
                setPlayer(response.data);
            } catch (e: any) {
                setError(e.message);
            }
        }
        fetchData();
    }, [apiClient, playerDetails.region, playerDetails.playerName]);

    return (
        <>
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
                            Search result for {playerDetails.playerName}
                        </Text>
                    </chakra.h1>
                </Box>
                {error && <Text>Player could not be found.</Text>}
                {player === null ?
                    <Box>
                        <Spinner size='xl'/>
                    </Box>
                    :
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
                        <Grid
                            templateColumns={{
                                base: "repeat(6, 1fr)",
                            }}
                            height={{
                                base: "full",
                                md: "auto",
                            }}
                            gap={{
                                xl: 1,
                                md: 2,
                            }}
                            width={"100%"}
                        >
                            <GridItem rowSpan={1} colSpan={2}>
                                <PlayerNameCard
                                    playerDetails={{playerName: player?.name, region: playerDetails.region}}
                                    summonerLevel={player?.summonerLevel!}
                                    imageId={player?.profileIconId!}
                                />
                            </GridItem>
                            {
                                player?.queues?.map((queue) => {
                                    return (
                                        <>
                                            <GridItem rowSpan={1} colSpan={2}>
                                                <RankCard queue={queue}/>
                                            </GridItem>
                                        </>
                                    );
                                })
                            }

                        </Grid>
                        <Grid
                            templateRows={{
                                base: "repeat(1, 0.5fr)",
                            }}
                            templateColumns={{
                                base: "repeat(2, 0.5fr)",
                            }}
                            gap={{
                                xl: 1,
                                md: 2,
                            }}
                            width={"100%"}
                        >
                            <MainStatsCard matches={player.matches!} playerInfo={playerDetails}/>
                        </Grid>
                        <Grid
                            templateRows={{
                                base: "repeat(2, 1fr)",
                            }}
                            templateColumns={{
                                base: "repeat(2, 1fr)",
                            }}
                            height={{
                                base: "full",
                                md: "auto",
                            }}
                            gap={{
                                xl: 2,
                                md: 3,
                            }}
                            width={"100%"}
                        >
                            {player.matches != null ?
                                <>
                                    <GridItem rowSpan={2} colSpan={2}>
                                        <GameTable matches={player.matches} playerData={playerDetails} games={5}/>
                                    </GridItem>
                                </>
                                : <Spinner size='xl'/>
                            }
                        </Grid>
                    </VStack>
                }
            </Box>
        </>
    );
}