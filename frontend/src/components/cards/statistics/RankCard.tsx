import {Avatar, Heading, HStack, Text, VStack} from "@chakra-ui/react";
import Emblem_Iron from "../../../assets/Emblem_Iron.png";
import Emblem_Bronze from "../../../assets/Emblem_Bronze.png";
import Emblem_Silver from "../../../assets/Emblem_Silver.png";
import Emblem_Gold from "../../../assets/Emblem_Gold.png";
import Emblem_Platinum from "../../../assets/Emblem_Platinum.png";
import Emblem_Diamond from "../../../assets/Emblem_Diamond.png";
import Emblem_Master from "../../../assets/Emblem_Master.png";
import Emblem_Grandmaster from "../../../assets/Emblem_Grandmaster.png";
import Emblem_Challenger from "../../../assets/Emblem_Challenger.png";

import {Queue} from "../../../adapter/api/__generated";


type RankCardProps = {
    queue: Queue;
}

export const RankCard = ({queue}: RankCardProps) => {

    //generate a readable name for the queue
    const generateReadableQueueName = (queue: Queue) => {
        if (queue.queueType === "RANKED_SOLO_5x5") {
            return "Ranked Solo";
        } else {
            return "Ranked Flex";
        }

    }
    //generate image from the rank name
    const generateRankImage = (rank: string) => {
        switch (rank) {
            case "IRON":
                return Emblem_Iron;
            case "BRONZE":
                return Emblem_Bronze;
            case "SILVER":
                return Emblem_Silver;
            case "GOLD":
                return Emblem_Gold;
            case "PLATINUM":
                return Emblem_Platinum;
            case "DIAMOND":
                return Emblem_Diamond;
            case "MASTER":
                return Emblem_Master;
            case "GRANDMASTER":
                return Emblem_Grandmaster;
            case "CHALLENGER":
                return Emblem_Challenger;
            default:
                return "no rank";
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
                <Heading as={"h2"} fontSize="xl" fontWeight="medium" mb={4}>{generateReadableQueueName(queue)}</Heading>
                <HStack spacing={6}
                        justifyContent="center"
                        alignItems="center"
                >
                    <Avatar size='2xl'
                            src={generateRankImage(queue.tier)}/>
                    <Text fontSize="xl" fontWeight="medium">{queue.tier} {queue.rank}</Text>
                </HStack>
                <HStack
                    mt={"2"}
                    justifyContent={"space-between"}
                    width={'100%'}
                >
                    <Text fontSize={"sm"}>{queue.wins} Wins</Text>
                    <Text fontSize={"sm"}>{queue.losses} Loses</Text>
                    <Text fontSize={"sm"}>{queue.leaguePoints} LP</Text>
                </HStack>
            </VStack>
        </>
    );
}
