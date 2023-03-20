import {GridItem, Spinner} from "@chakra-ui/react";
import {WinLostStatsCard} from "./statistics/WinLostStatsCard";
import {MinionKillsCard} from "./statistics/MinionKillsCard";
import React, {useEffect, useState} from "react";
import {Match, MatchData} from "../../adapter/api/__generated";
import {useApiClient} from "../../adapter/api/useApiClient";
import {PlayerSearchType} from "../PlayerSearch";

type MainStatsCardProps = {
    matches: Match[]
    playerInfo: PlayerSearchType
}

/**
 * Represents the minimum main statistics of a player. Includes win/loss, minion kills, etc.
 * @param matches
 * @param playerInfo
 * @constructor
 */
export const MainStatsCard = ({matches, playerInfo}: MainStatsCardProps) => {

    const [matchData, setMatchData] = useState<MatchData[]>([]);
    const api = useApiClient();

    useEffect(() => {

        const fetchData = async () => {
            let matchDataTemp: MatchData[] = [];
            for (const match of matches) {
                //@ts-ignore
                let response = await api.riotApiGetMatchDataByIdGet(playerInfo.region, match)
                matchDataTemp.push(response.data);
            }
            setMatchData(matchDataTemp);
        }

        fetchData()

    }, [matches, playerInfo.region, api]);


    return (
        <>
            {
                matchData.length === 20 ?
                    <>
                        <GridItem  colSpan={1}>
                            <WinLostStatsCard matches={matchData}
                                              playerInfo={playerInfo}/>

                        </GridItem>
                        <GridItem  colSpan={1}>
                            <MinionKillsCard matches={matchData}
                                             playerInfo={playerInfo}/>

                        </GridItem>
                    </>
                    : <Spinner size={"xl"}/>}
        </>
    );

}