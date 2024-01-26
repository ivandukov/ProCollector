import {RequestHandler} from "express";
import {leagueJsMatchDataById, leagueJsMatchDataTimelineById,} from "./externalAPIController/riotAPI.controller";
import {DI} from "../index";
import {wrap} from "@mikro-orm/core";
import {AddEvaluationDTO, Evaluation, EvaluationSchema} from "../entities";


interface EvaluationInterface {
    summonerName: string;
    lane: string;
    feedback: string;
    tag: string;
    description: string;
}

export const createEvaluation = async (region: string, matchId: string, summonerName: string) => {

    const matchData = await leagueJsMatchDataById(region, matchId);
    const matchDataTimeline = await leagueJsMatchDataTimelineById(region, matchId);
    if (matchDataTimeline.errors || matchData.errors) {
        return matchData;
    }
    if ((matchData.gameDuration / 60) < 15) {
        return ({errors: "match duration under 15 minutes"});
    }


    let evaluations: EvaluationInterface[] = [];
    let summonerMain;
    let summonerOpponent;

    //GET Main Summoner
    for (const participant of matchData.participants) {
        if (participant.summonerName == summonerName) {
            summonerMain = participant;
        }
    }
    //GET Opponent Summoner
    for (const participant of matchData.participants) {
        if (summonerMain.teamId != participant.teamId && summonerMain.teamPosition == participant.teamPosition) {
            summonerOpponent = participant;
        }
    }
    let killedOpponent = 0;
    let killedMain = 0;
    let earlyXpSummoner = 0;
    let earlyXpSummonerOpponent = 0;
    let earlyGoldSummoner = 0;
    let earlyGoldSummonerOpponent = 0;
    let earlyMinionKillsSummoner = 0;
    let earlyMinionKillsSummonerOpponent = 0;
    let gotSoloKilled = 0;


    //Check matchdataTimeLine for rival Duel
    for (const frame of matchDataTimeline.info.frames) {
        //CHECK GOLD MINUTE 15
        if ((frame.timestamp / 60) <= 15000) {
            earlyGoldSummoner = frame.participantFrames[summonerMain.participantId].totalGold;
            earlyGoldSummonerOpponent = frame.participantFrames[summonerOpponent.participantId].totalGold;
            earlyXpSummoner = frame.participantFrames[summonerMain.participantId].xp;
            earlyXpSummonerOpponent = frame.participantFrames[summonerOpponent.participantId].xp;
            earlyMinionKillsSummoner = frame.participantFrames[summonerMain.participantId].minionsKilled + frame.participantFrames[summonerMain.participantId].jungleMinionsKilled;
            earlyMinionKillsSummonerOpponent = frame.participantFrames[summonerOpponent.participantId].minionsKilled + frame.participantFrames[summonerOpponent.participantId].jungleMinionsKilled;
        }

        for (const event of frame.events) {
            if (event.type == "CHAMPION_KILL"
                && summonerMain.participantId == event.killerId
                && summonerOpponent.participantId == event.victimId) {
                killedOpponent++;
            }
            if (event.type == "CHAMPION_KILL"
                && summonerMain.participantId == event.victimId
                && summonerOpponent.participantId == event.killerId) {
                killedMain++;
            }

            //check gotSoloKilled
            if (event.type == "CHAMPION_KILL" && summonerMain.participantId == event.victimId) {
                let soloKilled = 0;
                for (const victimDamageReceived of event.victimDamageReceived) {
                    if (event.victimDamageReceived[0].name == victimDamageReceived.name) {
                        soloKilled++;
                    }
                }
                console.log(soloKilled);
                console.log(event.victimDamageReceived.length);

                if (soloKilled >= event.victimDamageReceived.length) {
                    gotSoloKilled++;
                }
            }
        }
    }

    if (gotSoloKilled >= 1) {
        let ev: EvaluationInterface =
            {
                summonerName: summonerMain.summonerName,
                tag: "Got Solo Killed",
                description: `You got ${gotSoloKilled} time(s) solo killed!`,
                feedback: "BAD",
                lane: "ALL"
            }
        evaluations.push(ev);
    }
    if (earlyMinionKillsSummoner > earlyMinionKillsSummonerOpponent) {
        let ev: EvaluationInterface =
            {
                summonerName: summonerMain.summonerName,
                tag: "Early Lane Minion Kills Winner",
                description: `You had ${earlyMinionKillsSummoner} minion kills before 15 minutes and your lane opponent ${summonerOpponent.championName} only had ${earlyMinionKillsSummonerOpponent} minion kills.`,
                feedback: "GOOD",
                lane: "ALL"
            }
        evaluations.push(ev);
    } else {
        let ev: EvaluationInterface =
            {
                summonerName: summonerMain.summonerName,
                tag: "Early Lane Minion Kills Looser",
                description: `You had ${earlyMinionKillsSummoner} minion kills before 15 minutes and your lane opponent ${summonerOpponent.championName} had ${earlyMinionKillsSummonerOpponent} minion kills.`,
                feedback: "BAD",
                lane: "ALL"
            }
        evaluations.push(ev);
    }


    if (earlyMinionKillsSummoner > earlyMinionKillsSummonerOpponent && earlyXpSummoner > earlyXpSummonerOpponent && summonerMain.win == true) {
        let ev: EvaluationInterface =
            {
                summonerName: summonerMain.summonerName,
                tag: "Win Lane, Win Game",
                description: `Good Job. You had ${earlyMinionKillsSummoner} minion kills and ${earlyXpSummoner} xp before 15 minutes and your lane opponent ${summonerOpponent.championName} only had ${earlyMinionKillsSummonerOpponent} minion kills and ${earlyXpSummonerOpponent} xp.`,
                feedback: "GOOD",
                lane: "ALL"
            }
        evaluations.push(ev);
    }

    if (earlyMinionKillsSummoner < earlyMinionKillsSummonerOpponent && earlyXpSummoner < earlyXpSummonerOpponent && summonerMain.win == false) {
        let ev: EvaluationInterface =
            {
                summonerName: summonerMain.summonerName,
                tag: "Loose Lane, Loose Game",
                description: `Maybe next time. You had ${earlyMinionKillsSummoner} minion kills and ${earlyXpSummoner} xp before 15 minutes and your lane opponent ${summonerOpponent.championName} had ${earlyMinionKillsSummonerOpponent} minion kills and ${earlyXpSummonerOpponent} xp.`,
                feedback: "BAD",
                lane: "ALL"
            }
        evaluations.push(ev);
    }

    if (earlyGoldSummoner > earlyGoldSummonerOpponent) {
        let ev: EvaluationInterface =
            {
                summonerName: summonerMain.summonerName,
                tag: "Early Lane Gold Winner",
                description: `You had ${earlyGoldSummoner} gold before 15 minutes and your lane opponent ${summonerOpponent.championName} only had ${earlyGoldSummonerOpponent} gold.`,
                feedback: "GOOD",
                lane: "ALL"
            }
        evaluations.push(ev);
    } else {
        let ev: EvaluationInterface =
            {
                summonerName: summonerMain.summonerName,
                tag: "Early Lane Gold Looser",
                description: `You had ${earlyGoldSummoner} gold before 15 minutes and your lane opponent ${summonerOpponent.championName} had ${earlyGoldSummonerOpponent} gold.`,
                feedback: "BAD",
                lane: "ALL"
            }
        evaluations.push(ev);
    }


    if (killedOpponent > killedMain) {
        let ev: EvaluationInterface =
            {
                summonerName: summonerMain.summonerName,
                tag: "Opponent Killer Winner",
                description: `You have killed your lane opponent ${summonerOpponent.championName}  ${killedOpponent} times, but he only killed you ${killedMain} times.`,
                feedback: "GOOD",
                lane: "ALL"
            }
        evaluations.push(ev);
    } else {
        let ev: EvaluationInterface =
            {
                summonerName: summonerMain.summonerName,
                tag: "Opponent Killer Looser",
                description: `Your lane opponent ${summonerOpponent.championName} has killed you ${killedMain} times, but you only killed him ${killedOpponent} times.`,
                feedback: "BAD",
                lane: "ALL"
            }
        evaluations.push(ev);
    }


    if (summonerMain.controlWardsPlaced == 0) {
        let ev: EvaluationInterface =
            {
                summonerName: summonerMain.summonerName,
                tag: "No Control Wards",
                description: `You have placed ${summonerMain.controlWardsPlaced} Control Wards. Control Wards are important!`,
                feedback: "BAD",
                lane: "ALL"
            }
        evaluations.push(ev);
    }

    if (summonerMain.soloKills >= 3) {
        let ev: EvaluationInterface =
            {
                summonerName: summonerMain.summonerName,
                tag: "Predator",
                description: `You have killed ${summonerMain.soloKills} players alone.`,
                feedback: "GOOD",
                lane: "ALL"
            }
        evaluations.push(ev);
    }

    if (summonerMain.tripleKills >= 1) {
        let ev: EvaluationInterface =
            {
                summonerName: summonerMain.summonerName,
                tag: "Triple Kill",
                description: `You have made ${summonerMain.tripleKills} triple kills.`,
                feedback: "GOOD",
                lane: "ALL"
            }
        evaluations.push(ev);
    }
    if (summonerMain.quadraKills >= 1) {
        let ev: EvaluationInterface =
            {
                summonerName: summonerMain.summonerName,
                tag: "Quadra Kill",
                description: `You have made ${summonerMain.quadraKills} quadra kills.`,
                feedback: "GOOD",
                lane: "ALL"
            }
        evaluations.push(ev);
    }
    if (summonerMain.pentaKills >= 1) {
        let ev: EvaluationInterface =
            {
                summonerName: summonerMain.summonerName,
                tag: "Penta Kill",
                description: `You have made ${summonerMain.pentaKills} Penta kills.`,
                feedback: "GOOD",
                lane: "ALL"
            }
        evaluations.push(ev);
    }

    if (summonerMain.skillshotsDodged >= 50) {
        let ev: EvaluationInterface =
            {
                summonerName: summonerMain.summonerName,
                tag: "Neo Cosplayer",
                description: `You have dodged ${summonerMain.skillshotsDodged} skillshots.`,
                feedback: "GOOD",
                lane: "ALL"
            }
        evaluations.push(ev);
    }


    if (summonerMain.totalDamageDealtToChampions > summonerOpponent.totalDamageDealtToChampions &&
        summonerMain.kda > summonerOpponent.kda &&
        summonerMain.totalMinionsKilled > summonerOpponent.totalMinionsKilled &&
        summonerMain.visionScore > summonerOpponent.visionScore
    ) {
        let ev: EvaluationInterface =
            {
                summonerName: summonerMain.summonerName,
                tag: "Opponent Dominator",
                description: `You have dominated your opponent! Your kda, total damage, vision score and total minion kills are better.  `,
                feedback: "GOOD",
                lane: "ALL"
            }
        evaluations.push(ev);
    }


    let totalDamageDealtToChampions = true;
    let visionScorePerMinute = true;
    let goldEarned = true;
    let totalMinionsKilled = true;
    let skillshotsHit = true;
    let deathsLow = true;
    let deathsHigh = true;

    for (const participant of matchData.participants) {
        //CHECK FOR totalDamageDealtToChampions
        if (summonerMain.totalDamageDealtToChampions < participant.totalDamageDealtToChampions) {
            totalDamageDealtToChampions = false;
        }
        //CHECK FOR visionScorePerMinute
        if (summonerMain.visionScorePerMinute < participant.visionScorePerMinute) {
            visionScorePerMinute = false;
        }
        //CHECK FOR goldPerMinute
        if (summonerMain.goldEarned < participant.goldEarned) {
            goldEarned = false;
        }
        //CHECK FOR totalMinionsKilled
        if (summonerMain.totalMinionsKilled < participant.totalMinionsKilled) {
            totalMinionsKilled = false;
        }

        //CHECK FOR skillshotsHit
        if (summonerMain.skillshotsHit < participant.skillshotsHit) {
            skillshotsHit = false;
        }
        //CHECK for deathsLow
        if (summonerMain.deaths < participant.deaths) {
            deathsLow = false;
        }
        //CHECK for deathsHigh
        if (summonerMain.deaths > participant.deaths) {
            deathsHigh = false;
        }

    }

    if (deathsLow) {
        let ev: EvaluationInterface =
            {
                summonerName: summonerMain.summonerName,
                tag: "Lowest Deaths",
                description: `You had the lowest deaths ${summonerMain.deaths} in this game.`,
                feedback: "GOOD",
                lane: "ALL"
            }
        evaluations.push(ev);
    }
    if (deathsHigh) {
        let ev: EvaluationInterface =
            {
                summonerName: summonerMain.summonerName,
                tag: "Highest Deaths",
                description: `You had the highest deaths ${summonerMain.deaths} in this game.`,
                feedback: "BAD",
                lane: "ALL"
            }
        evaluations.push(ev);
    }

    if (skillshotsHit) {
        let ev: EvaluationInterface =
            {
                summonerName: summonerMain.summonerName,
                tag: "Sniper",
                description: `You have hit the most skillshots in this game - ${summonerMain.skillshotsHit}`,
                feedback: "GOOD",
                lane: "ALL"
            }
        evaluations.push(ev);
    }

    if (totalDamageDealtToChampions) {
        let ev: EvaluationInterface =
            {
                summonerName: summonerMain.summonerName,
                tag: "Most Damage Done",
                description: `You have done the most damage in this game - ${summonerMain.totalDamageDealtToChampions}`,
                feedback: "GOOD",
                lane: "ALL"
            }
        evaluations.push(ev);
    }

    if (visionScorePerMinute) {
        let ev: EvaluationInterface =
            {
                summonerName: summonerMain.summonerName,
                tag: "Eye of Sauron",
                description: `You have the highest vision score in the rift - ${summonerMain.visionScorePerMinute}`,
                feedback: "GOOD",
                lane: "ALL"
            }
        evaluations.push(ev);
    }

    if (goldEarned) {
        let ev: EvaluationInterface =
            {
                summonerName: summonerMain.summonerName,
                tag: "Wolf of Wallstreet",
                description: `You have generated the most gold in the rift - ${summonerMain.goldEarned}`,
                feedback: "GOOD",
                lane: "ALL"
            }
        evaluations.push(ev);
    }

    if (totalMinionsKilled) {
        let ev: EvaluationInterface =
            {
                summonerName: summonerMain.summonerName,
                tag: "Anti Banana Club",
                description: `You have killed the most minions in the rift - ${summonerMain.totalMinionsKilled}`,
                feedback: "GOOD",
                lane: "ALL"
            }
        evaluations.push(ev);
    }

    return evaluations;

}

export const getEvaluationUser: RequestHandler<{}> = async (
    req,
    res
) => {

    const matchId = req.query.matchId as string;
    const summonerName = req.query.summonerName as string;

    try {
        const findMatch = await DI.matchRepository.findOne({
            id: matchId,
        }, {populate: ["evaluations"]}).catch((e) => {
            console.log(e);
        });
        if (!findMatch) {
            return res.status(400).json({errors: ["Match does not exist"]});
        }
        let evaluations: Evaluation[] = [];
        for (const evaluation of findMatch.evaluations) {
            if (evaluation.summonerName == summonerName) {
                evaluations.push(evaluation);
            }
        }
        res.send(evaluations);

    } catch (e: any) {
        return res.status(400).json({errors: [e.message]});
    }

}


export const getEvaluationMatch: RequestHandler<{}> = async (
    req,
    res
) => {

    const region = req.query.region as string;
    const matchId = req.query.matchId as string;
    const summonerName = req.query.summonerName as string;

    let evaluations = await createEvaluation(region, matchId, summonerName);

    if (!evaluations.errors) {
        res.status(200).json(evaluations);
    } else {
        res.status(400).json(evaluations);
    }

}


export const addEvaluation: RequestHandler<{}> = async (
    req,
    res
) => {
    try {
        const findMatch = await DI.matchRepository.findOne({
            id: req.body.matchId,
        }, {populate: ["evaluations"]}).catch((e) => {
            console.log(e);
        });
        if (!findMatch) {
            return res.status(400).json({errors: ["Match does not exist"]});
        }

        if (findMatch.evaluations.length >= 1) {
            for (const ev of findMatch.evaluations) {
                if (ev.summonerName == req.body.summonerName) {
                    return res.status(302).json({errors: ["Game already evaluated for summoner"]});
                }
            }

        }

        let evaluations = await createEvaluation(req.body.region, req.body.matchId, req.body.summonerName);
        if (evaluations.errors) {
            res.status(400).json(evaluations);
        }

        for (const evaluation of evaluations) {
            const validatedData = await EvaluationSchema.validate(evaluation).catch(
                (e) => {
                    console.log(req.body);
                    res.status(400).json({errors: e.errors});
                }
            );
            if (!validatedData) {
                return;
            }
            const addEvaluationDTO: AddEvaluationDTO = {
                ...validatedData
            };
            const newEvaluation = new Evaluation(addEvaluationDTO);
            newEvaluation.matchId = findMatch;
            findMatch.evaluations.add(newEvaluation);

        }

        await wrap(findMatch).assign(findMatch);
        await DI.matchRepository.persistAndFlush(findMatch);
        res.json(findMatch);


    } catch (e: any) {
        return res.status(400).json({errors: [e.message]});
    }

}





