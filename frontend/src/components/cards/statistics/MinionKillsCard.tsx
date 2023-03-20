import {useEffect, useState} from "react";
import {Participant} from "../../../adapter/api/__generated";
import {Box, Flex, Heading} from "@chakra-ui/react";
import {VictoryChart, VictoryLine, VictoryTheme} from "victory";
import {StatisticsMainCardProps} from "./WinLostStatsCard";
import {findMe} from "../../../helper/MatchInfoNormalizer";

export const MinionKillsCard = ({matches, playerInfo}: StatisticsMainCardProps) => {

    const [chartData, setChartData] = useState<any[]>([]);

    const calculateMinionKills = () => {
        matches.forEach((match, index) => {
            let me: Participant | null;
            me = findMe(match, playerInfo.playerName);
            if (me) {
                let minionsForMinute = me?.totalMinionsKilled! / Math.floor(Number(match.gameDuration) / 60);

                setChartData(chartData => [...chartData, {
                    x: index, y: minionsForMinute
                }])
            }
        })
    }

    useEffect(() => {
        setChartData([]);
        calculateMinionKills();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Flex
                alignItems="center"
                justifyContent="center"
                width={'100%'}
                height={'100%'}
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
                    height={'100%'}
                >
                    <Heading as={"h2"} fontSize="xl" fontWeight="medium" mb={2}>Average Minion Kills every minute for
                        the last 20 games</Heading>
                    <Flex justifyContent={"center"}>
                        <VictoryChart
                            theme={VictoryTheme.material}
                            style={{parent: {maxWidth: "60%", height: "50%", margin: "auto"}}}
                        >
                            <VictoryLine
                                style={{
                                    data: {stroke: "#c43a31"},
                                    parent: {border: "1px solid #ccc"},
                                    labels: {color: "#c43a31"},
                                }}
                                interpolation="natural"
                                data={chartData}
                            />
                        </VictoryChart>
                    </Flex>
                </Box>
            </Flex>
        </>
    );
}