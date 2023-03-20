import {Avatar, HStack, IconButton, Link, useToast} from "@chakra-ui/react";
import {DeleteIcon} from "@chakra-ui/icons";
import {Follower} from "../../../adapter/api/__generated";
import {useNavigate} from "react-router-dom";
import {useApiClient} from "../../../adapter/api/useApiClient";
import {useLoggedInUser} from "../../../helper/useLoggedInUser";

type FollowerCardProps = {
    follower: Follower;
    updateFollowerList: () => void;
}

export const FollowerCard = ({follower, updateFollowerList}: FollowerCardProps) => {

    const navigate = useNavigate();
    const toast = useToast();
    const api = useApiClient();
    const {user} = useLoggedInUser();

    const deleteFollower = async () => {
        try {
            const res = await api.deleteFollowerFollowerId(follower.id!, user?.id!, {withCredentials: true});
            res.status === 204 && updateFollowerList();

            toast({
                title: "Follower deleted",
                description: "You have deleted a follower",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

        } catch (e) {
            toast({
                title: "Error",
                description: "Something went wrong while deleting your follower",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }

    function navigateToFollower() {
        navigate("/search", {
            state: {
                playerName: follower.followerName,
                region: follower.region
            }
        })
        window.location.reload();
    }

    return (
        <>
            <HStack
                alignItems={"center"}
                justifyContent={"space-between"}
                width={"100%"}
            >
                <HStack>
                    <Avatar size={"md"} name={follower.followerName}
                            src={`http://ddragon.leagueoflegends.com/cdn/12.11.1/img/profileicon/${follower.profileIconId!}.png`}
                            onClick={() => navigateToFollower()}/>
                    <Link onClick={() => navigateToFollower()}> {follower.followerName}</Link>
                </HStack>
                <IconButton
                    aria-label={"Delete"}
                    icon={<DeleteIcon/>}
                    onClick={() => deleteFollower()}
                />
            </HStack>
        </>
    );
}