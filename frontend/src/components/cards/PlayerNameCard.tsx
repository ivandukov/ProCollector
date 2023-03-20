import {Avatar, Grid, Heading, HStack, Text, Tooltip, useToast, VStack} from "@chakra-ui/react";
import {useLoggedInUser} from "../../helper/useLoggedInUser";
import {useApiClient} from "../../adapter/api/useApiClient";
import {PlayerSearchType} from "../PlayerSearch";
import {InfoOutlineIcon} from "@chakra-ui/icons";


type PlayerNameCardProps = {
    playerDetails: PlayerSearchType;
    summonerLevel: number;
    imageId: number;
}

export const PlayerNameCard = (props: PlayerNameCardProps) => {

    const toast = useToast();
    const {user} = useLoggedInUser();
    const api = useApiClient();

    const addFollower = async () => {
        if (user === null) {
            toast({
                title: "You must be logged in to add a follower",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        } else {
            try {
                await api.postFollower({
                    followerName: props.playerDetails.playerName,
                    userId: user.id,
                    region: props.playerDetails.region!,
                    profileIconId: props.imageId!,
                }, {withCredentials: true});
                toast({
                    title: "Follower added",
                    description: "You have added a follower",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } catch (e) {
                toast({
                    title: "Error",
                    description: "Something went wrong while adding a follower",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    }


    return (
        <>
            <VStack
                border={"1px"}
                borderColor={"#3f444e"}
                rounded={"lg"}
                p={2}
                height={'100%'}
            >
                <Grid
                    width={'100%'}
                    templateColumns={"1fr 1fr 1fr"}
                >
                    <Tooltip fontSize={"md"} label={"Click on the profile avatar to follow."}>
                        <InfoOutlineIcon alignSelf={"flex-start"}/>
                    </Tooltip>
                    <Heading as={"h2"} fontSize="xl"
                             alignSelf={"center"}
                             fontWeight="medium"
                             mb={4}>{props.playerDetails.playerName}</Heading>
                </Grid>
                <HStack spacing={6}
                        justifyContent="center"
                        alignItems="center"
                >
                    <Tooltip fontSize={"md"} label={"Click here to follow me!"}>
                        <Avatar size='2xl'
                                src={`http://ddragon.leagueoflegends.com/cdn/12.11.1/img/profileicon/${props.imageId}.png`}
                                _hover={{
                                    border: "3px solid",
                                    borderColor: "#BE5A04",
                                    borderRadius: "9999px"
                                }}
                                transition={"outline 0.6s linear"}
                                onClick={() => addFollower()}
                        />
                    </Tooltip>
                    <Text fontSize="xl" fontWeight="medium">Level: {props.summonerLevel}</Text>
                </HStack>
            </VStack>
        </>
    );
}