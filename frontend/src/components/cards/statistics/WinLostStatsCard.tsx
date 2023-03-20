import {Box, Flex, Spinner} from "@chakra-ui/react";
import {PieChart} from "./PieChart";
import {MatchData, Participant} from "../../../adapter/api/__generated";
import {findMe} from "../../../helper/MatchInfoNormalizer";
import {PlayerSearchType} from "../../PlayerSearch";
import {useEffect, useState} from "react";


export type StatisticsMainCardProps = {
    matches: MatchData[]
    playerInfo: PlayerSearchType
}


export const WinLostStatsCard = ({matches, playerInfo}: StatisticsMainCardProps) => {

    const [wins, setWins] = useState(0);
    const [losses, setLosses] = useState(0);

    const calculateWinsAndLosses = () => {
        let wins = 0;
        let losses = 0;
        for (const match of matches) {
            let me: Participant | null;
            me = findMe(match, playerInfo.playerName);
            if (me) {
                if (me.win) {
                    wins++;
                } else {
                    losses++;
                }
            }
        }
        setWins(wins);
        setLosses(losses);
    }

    useEffect(() => {
        setWins(0);
        setLosses(0);
        calculateWinsAndLosses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <>
            <Flex
                alignItems="center"
                justifyContent="center"
                width={'100%'}
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
                    width={'100%'}
                >
                    <Flex mt={2} width={"100%"} justifyContent={"center"}>
                        {wins > 0 && losses > 0 ?
                            <PieChart data={[{x: "Wins", y: wins}, {x: "Losses", y: losses}]}/>
                            : <Spinner size="xl"/>}
                    </Flex>
                    <Flex justifyContent="space-between" alignItems="center" mt={4}>
                        <Flex alignItems="center">
                        </Flex>
                    </Flex>
                </Box>
            </Flex>
        </>
    );

}