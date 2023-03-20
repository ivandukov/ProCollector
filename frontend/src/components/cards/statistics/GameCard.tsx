import {
    Avatar,
    Box,
    Collapse,
    Divider,
    HStack,
    IconButton,
    Link,
    SimpleGrid,
    Spinner,
    Text,
    Tooltip,
    useDisclosure,
    VStack
} from "@chakra-ui/react";
import {MatchData} from "../../../adapter/api/__generated";
import {matchInfoNormalizer, NormalizedMatchData} from "../../../helper/MatchInfoNormalizer";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {PlayerSearchType} from "../../PlayerSearch";
import {ArrowDownIcon, ArrowUpIcon} from "@chakra-ui/icons";
import {MatchAnalyzerCard} from "./MatchAnalyzerCard";

type GameCardProps = {
    match: MatchData
    playerData: PlayerSearchType
    isDashboard?: boolean
}


export const GameCard = ({match, playerData, isDashboard}: GameCardProps) => {

    const [normalizedData, setNormalizedData] = useState<NormalizedMatchData | null>(null);
    const navigate = useNavigate();
    useEffect(() => {
        setNormalizedData(null);
        let normalizedData = matchInfoNormalizer(match, playerData.playerName);
        setNormalizedData(normalizedData);
    }, [match, playerData.playerName]);

    const {isOpen, onToggle} = useDisclosure()


    return (
        <>
            <HStack
                border={"1px"}
                borderColor={normalizedData?.isMatchWon === "Won" ? "#8AFF89" : "#FC7171"}
                rounded="lg"
                p={2}
                width={"100%"}
                justifyContent={"space-between"}
            >
                {normalizedData !== null ?
                    <>
                        {/*Game Type*/}
                        <Box fontSize={"sm"}>
                            <Text>Solo 5v5</Text>
                            <Text>{normalizedData!.duration} Minutes</Text>
                            <Text>{normalizedData.matchDate}</Text>
                            <Divider/>
                            <Text>{normalizedData!.isMatchWon}</Text>
                        </Box>
                        {/*Hero*/}
                        <VStack
                            fontSize={"sm"}
                            minWidth={"10%"}
                            width={"15%"}
                        >
                            <Avatar size='md'
                                    src={`https://ddragon.leagueoflegends.com/cdn/12.12.1/img/champion/${normalizedData!.hero}.png`}
                            />
                            <Tooltip label='Kills/Deaths/Assists' fontSize='md'>
                                <Text
                                    fontWeight={"bold"}>{normalizedData!.kills} / {normalizedData!.deaths} / {normalizedData!.assists}</Text>
                            </Tooltip>
                            <Text>{normalizedData!.kdaRatio} KDA Ratio</Text>
                        </VStack>
                        {/*Items*/}
                        <SimpleGrid
                            templateColumns={{
                                base: "repeat(4, 1fr)",
                            }}
                            templateRows={{
                                base: "repeat(2, 1fr)",
                            }}
                        >
                            {normalizedData.items.map(item => (
                                item !== 0 ?
                                    <Avatar key={item!}
                                        size='md'
                                            src={`http://ddragon.leagueoflegends.com/cdn/12.12.1/img/item/${item}.png`}/>
                                    :
                                    null
                            ))}
                        </SimpleGrid>
                        {/*Your team*/}
                        <VStack
                            alignItems={"flex-start"}
                            width={"15%"}
                        >
                            {normalizedData.ourTeam.map(teamParticipant => (
                                <HStack
                                    key={teamParticipant.championName!}
                                    alignItems={"flex-start"}
                                >
                                    <Avatar size='xs'
                                            src={`https://ddragon.leagueoflegends.com/cdn/12.12.1/img/champion/${teamParticipant.championName}.png`}/>
                                    {normalizedData!.me?.summonerName === teamParticipant.summonerName ?
                                        <Link fontWeight={"extrabold"}
                                              fontSize={"xs"}>{teamParticipant.summonerName}</Link> :
                                        <Link onClick={() => {
                                            navigate("/search", {
                                                state: {
                                                    playerName: teamParticipant.summonerName,
                                                    region: playerData.region
                                                }
                                            })
                                            window.location.reload();
                                        }} fontSize={"xs"}>{teamParticipant.summonerName}</Link>
                                    }
                                </HStack>
                            ))}
                        </VStack>
                        {/*Other team*/}
                        <VStack
                            alignItems={"flex-start"}
                            width={"20%"}
                        >
                            {normalizedData.theirTeam.map(teamParticipant => (
                                <HStack
                                    key={teamParticipant.championName!}
                                >
                                    <Avatar size='xs'
                                            src={`https://ddragon.leagueoflegends.com/cdn/12.12.1/img/champion/${teamParticipant.championName}.png`}/>
                                    <Link onClick={() => {
                                        navigate("/search", {
                                            state: {
                                                playerName: teamParticipant.summonerName,
                                                region: playerData.region
                                            }
                                        })
                                        window.location.reload();
                                    }} fontSize={"xs"}>{teamParticipant.summonerName}</Link>
                                </HStack>
                            ))}
                        </VStack>
                    </> : <Spinner size='xl'/>
                }
                <Tooltip
                    label={"Match evaluation"}>
                    <IconButton
                        variant={"ghost"}
                        icon={isOpen ? <ArrowUpIcon/> : <ArrowDownIcon/>}
                        onClick={onToggle}
                        aria-label={"Evaluate game"}
                        alignSelf={"flex-end"}
                    />
                </Tooltip>
            </HStack>
            <>
                <Collapse in={isOpen} animateOpacity style={{width: "100%"}}
                >
                    <MatchAnalyzerCard match={match} playerData={playerData} isDashboard={isDashboard}/>
                </Collapse>
            </>
        </>
    );
}