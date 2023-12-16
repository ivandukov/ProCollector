import {Box, Heading, useToast, VStack} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useLoggedInUser} from "../helper/useLoggedInUser";
import {Follower} from "../adapter/api/__generated";
import {FollowerCard} from "./cards/followers/FollowerCard";
import {useApiClient} from "../adapter/api/useApiClient";

export const FollowerList = () => {

    const toast = useToast();
    const {user} = useLoggedInUser();
    const api = useApiClient();

    const [followers, setFollowers] = useState<Follower[] | null>(null);

    const getFollowers = async () => {
        try {
            const res = await api.getFollowerUser(user?.id, {withCredentials: true});
            setFollowers(res.data);
        } catch (e) {
            toast({
                    title: "Error",
                    description: "Something went wrong while getting your followers",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                }
            );
        }
    }

    useEffect(() => {
        if (user !== null) {
            getFollowers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);


    return (
        <>
            <VStack border={"1px"}
                    borderColor={"#3f444e"}
                    rounded="lg"
                    p={2}
                    height={'100%'}
            >
                <Heading as="h2" fontSize={"xl"} mb={2}>Following</Heading>
                <VStack width={"100%"}>
                    {followers != null && followers.length > 0 ?
                        followers.map(follower => {
                            return (
                                <FollowerCard key={follower.followerName} follower={follower}
                                              updateFollowerList={getFollowers}/>
                            )
                        })
                        :
                        <Box p='4'>
                            You don't have any followers. Try to connect with other players via search.
                        </Box>
                    }
                </VStack>
            </VStack>
        </>
    );
}