import {Box, Heading, VStack} from "@chakra-ui/react";
import {Match, MatchData} from "../../../adapter/api/__generated";
import React, {useEffect, useState} from "react";
import {useApiClient} from "../../../adapter/api/useApiClient";
import {GameCard} from "./GameCard";
import {PlayerSearchType} from "../../PlayerSearch";


type GameTableProps = {
    matches: Match[]
    playerData: PlayerSearchType
    /*
    * Amount of games to be shown in the table
     */
    games?: number
    /**
     * If true another design will be used
     */
    isDashboard?: boolean
}

export const GameTable = ({matches, playerData, games = 3, isDashboard = false}: GameTableProps) => {

    const api = useApiClient()
    const [lastMatches, setLastMatches] = useState<MatchData[]>([])


    useEffect(() => {
        setLastMatches([]);

        const fetchLastNMatches = async () => {
            let lastMatches: MatchData[] = [];
            for (const match of matches.slice(0, games)) {
                let searchedMatch = isDashboard ? match.id : match;
                //@ts-ignore
                let response = await api.riotApiGetMatchDataByIdGet(playerData.region!, searchedMatch)
                lastMatches.push(response.data)
            }
            setLastMatches(lastMatches)
        }
        fetchLastNMatches()
    }, [api, matches, playerData.region, games, isDashboard])


    return (
        <Box>
            <Heading as="h2" fontSize={"xl"} mb={2}> Last {games} games</Heading>
            <VStack gap={2} width={"100%"}>
                {lastMatches != null ?
                    lastMatches.map((match => {
                        return <>
                            <GameCard key={match.matchId!} match={match} playerData={playerData} isDashboard={isDashboard}/>
                        </>
                    }))
                    : null
                }
            </VStack>
        </Box>
    );
}