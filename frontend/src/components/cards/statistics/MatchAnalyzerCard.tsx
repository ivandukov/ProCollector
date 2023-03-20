import {Alert, AlertIcon, Box, Button, Heading, HStack, Spinner, Tag, Tooltip} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useLoggedInUser} from "../../../helper/useLoggedInUser";
import {useApiClient} from "../../../adapter/api/useApiClient";
import {Evaluation, MatchData} from "../../../adapter/api/__generated";
import {PlayerSearchType} from "../../PlayerSearch";


type MatchAnalyzerCardProps = {
    match: MatchData
    playerData: PlayerSearchType
    isDashboard?: boolean
}

enum EVALUATION_STAGE {
    INITIAL = "INITIAL",
    LOADING = "LOADING",
    READY = "READY"
}

export const MatchAnalyzerCard = ({match, playerData, isDashboard}: MatchAnalyzerCardProps) => {

    const {user} = useLoggedInUser();
    const api = useApiClient();
    const [evaluation, setEvaluation] = useState<Evaluation[] | null>(null);
    const [evaluationStage, setEvaluationStage] = useState<EVALUATION_STAGE>(EVALUATION_STAGE.INITIAL);


    async function evaluationHandler() {
        try {
            await api.evaluationAddEvaluationPut({
                matchId: match.matchId,
                region: playerData.region!,
                summonerName: playerData.playerName,
            })
        } catch (e: any) {
            if (e.response.status === 302) {
                await evaluateGame();
            }
        }
    }


    useEffect(() => {
        if (isDashboard) {
            evaluationHandler();

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const evaluateGame = async () => {
        setEvaluationStage(EVALUATION_STAGE.LOADING);
        if (isDashboard) {
            const res = await api.getEvaluationGetEvaluationUser(match.matchId!, playerData.playerName!);
            setEvaluation(res.data);
        } else {
            const response = await api.evaluationGetEvaluationMatchGet(playerData.region!, match.matchId!, playerData.playerName!);
            setEvaluation(response.data);
        }
        setEvaluationStage(EVALUATION_STAGE.READY);
    };

    const evaluationStageHandler = () => {
        const initAlert = () => {
            return (
                <Alert status='info'>
                    <AlertIcon/>
                    Evaluation of this match is available. Click <Button pl={2} pr={2} variant={"ghost"}
                                                                         onClick={() => evaluateGame()}>here</Button> to
                    start evaluation.
                </Alert>
            )
        }

        const evaluationReady = () => {
            return (
                <>
                    <Tooltip
                        label={"The results of the evaluation are the following tags, which give you feedback what have you done right and wrong."}>
                        <Heading size={"md"} pr={5}>Evaluation Tags: </Heading>
                    </Tooltip>
                    {evaluation?.map(evaluation => {
                        return (
                            <Tooltip label={evaluation.description} key={evaluation.summonerName! + evaluation.tag!}>
                                <Tag
                                    variant='outline'
                                    colorScheme={evaluation.feedback === "GOOD" ? "green" : "red"}
                                    size={"lg"}>{evaluation.tag}</Tag>
                            </Tooltip>
                        )
                    })}
                </>
            )
        }

        switch (evaluationStage) {
            case EVALUATION_STAGE.INITIAL:
                return initAlert();
            case EVALUATION_STAGE.LOADING:
                return <Spinner size="sm"/>;
            case EVALUATION_STAGE.READY:
                return evaluationReady();
            default:
                return <Alert status="error">Error</Alert>;
        }
    }

    return (
        <Box
            p={2}
            color='white'
            mt='2'
            border={"1px"}
            borderColor={'#3f444e'}
            rounded="lg"
            shadow='md'
            width={"100%"}

        >
            {user === null ?
                <>
                    <Alert status={"warning"}>
                        <AlertIcon/>
                        Only logged in users can evaluate games using our Match analyzer &#8482;.
                    </Alert>
                </> :
                <HStack>
                    {evaluationStageHandler()}
                </HStack>
            }
        </Box>
    );
}