import {Box, chakra, Grid, GridItem, HStack, IconButton, Spinner, Stack, Text, Tooltip, VStack} from "@chakra-ui/react";
import React from "react";
import {FollowerList} from "../components/FollowerList";
import {PlayerSearchCard} from "../components/PlayerSearchCard";
import {useLoggedInUser} from "../helper/useLoggedInUser";
import {RankCard} from "../components/cards/statistics/RankCard";
import {GameTable} from "../components/cards/statistics/GameTable";
import {RepeatIcon} from "@chakra-ui/icons";
import {useApiClient} from "../adapter/api/useApiClient";
import {User} from "../adapter/api/__generated";

export const Dashboard = () => {

    const {user, setUser, setUserFromStorage} = useLoggedInUser();
    const api = useApiClient();

    /**
     * Updates the available user data
     */
    const updateDashboardDataHandler = async () => {
        const res = await api.putSummonerUpdateSummoner(user?.summonerName.region!, user?.summonerName.name!);
        const updatedUser = res.data;
        let currentUser: User = JSON.parse(sessionStorage.getItem('user')!);
        //@ts-ignore
        currentUser.User.summonerName = updatedUser;
        sessionStorage.setItem('user', JSON.stringify(currentUser));
        setUser(null);
        setUserFromStorage();
        window.location.reload();
    }

    return (
        <>
            {
                user === null ? <Spinner size={"xl"}/> :
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
                                <HStack>
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
                                        Dashboard - {user?.userName}
                                    </Text>
                                    <Tooltip fontSize={"md"} label={"Update dashboard data."}>
                                        <IconButton size='lg'
                                                    aria-label={"Update dashboard stats"}
                                                    icon={<RepeatIcon/>}
                                                    onClick={() => updateDashboardDataHandler()}
                                        />
                                    </Tooltip>
                                </HStack>
                            </chakra.h1>
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
                            <Grid
                                templateAreas=
                                    {`"rank rank"       
                                      "search search"
                                      "followers other"`}
                                gridTemplateRows={'1fr 1fr 1fr'}
                                gridTemplateColumns={'1fr 1fr'}
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
                                {
                                    user?.summonerName!.queues!.map((queue) => {
                                        return (
                                            <>
                                                <GridItem area={'rank'} rowSpan={1} colSpan={1}>
                                                    <RankCard key={queue.rank + queue.leaguePoints + queue.wins}
                                                              queue={queue}/>
                                                </GridItem>
                                            </>
                                        );
                                    })
                                }
                                <GridItem area={"search"}>
                                    <PlayerSearchCard/>
                                </GridItem>
                                <GridItem area={"followers"}>
                                    <FollowerList/>
                                </GridItem>
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
                                {user.summonerName.matches != null ?
                                    <>
                                        <GridItem rowSpan={2} colSpan={2}>
                                            <GameTable matches={user.summonerName.matches!}
                                                       playerData={{
                                                           playerName: user.summonerName.name,
                                                           region: user.summonerName.region
                                                       }}
                                                       games={8}
                                                       isDashboard={true}
                                            />
                                        </GridItem>
                                    </>
                                    : <Spinner size='xl'/>
                                }
                            </Grid>
                        </VStack>
                    </Box>
            }
        </>
    );
}