import {RequestHandler, Router} from "express";
import {DI} from "../index";
import {wrap} from "@mikro-orm/core";
import {leagueJsSummonerByName} from "./externalAPIController/riotAPI.controller";
import {AddMatchDTO, AddQueueDTO, AddSummonerDTO, Match, Queue, Summoner} from "../entities";

const router = Router();

export const createSummoner = async (region: string, summonerName: string) => {
    //SEARCH FOR SUMMONERNAME AND ADD TO USER. If SummonerName not found in RIOT API Cancel.
    const summonerByName = await leagueJsSummonerByName(region, summonerName);
    if (summonerByName.errors) {
        return summonerByName;
    }
    //CREATE NEW SUMMONER
    const addSummonerDTO: AddSummonerDTO = {
        ...summonerByName
    };
    const newSummoner = new Summoner(addSummonerDTO);

    //CREATE QUEUE AND ADD SUMMONER
    let newSummonerQueues: any[] = summonerByName.queues;
    for (const newSummonerQueue of newSummonerQueues) {
        const addQueueDTO: AddQueueDTO = {
            ...newSummonerQueue
        };
        // if (addQueueDTO.queueType == "RANKED_FLEX_SR" || addQueueDTO.queueType == "RANKED_SOLO_5x5") {
        const newQueue = new Queue(addQueueDTO);
        newQueue.summoner = newSummoner;
        newSummoner.queues.add(newQueue);
        // }

    }
    //CREATE MATCH, SEARCH FOR MATCH AND ADD SUMMONER
    let newSummonerMatches: any[] = summonerByName.matches;


    for (const newSummonerMatch of newSummonerMatches) {
        const addMatchDTO: AddMatchDTO = {
            id: newSummonerMatch
        };
        const newMatch = new Match(addMatchDTO);

        const existingMatch = await DI.matchRepository?.findOne({
            id: newMatch.id
        }, {populate: ["summoners"]}).catch(() => {
        });

        if (!existingMatch) { //nicht in der DB
            newMatch.summoners.add(newSummoner);
            newSummoner.matches.add(newMatch);
        } else { //in der DB
            //existingMatch.summoners.add(newSummoner);
            let checkSummoner = true;
            for (const existingMatchSummoner of existingMatch.summoners) {
                if (existingMatchSummoner.name == newSummoner.name) {
                    checkSummoner = false;
                }
            }
            if (checkSummoner) {
                existingMatch.summoners.add(newSummoner);
            }
        }
    }
    return newSummoner;
}


router.get("/:id", async (req, res) => {
    const Summoner = await DI.summonerRepository.findOne({
        id: req.params.id
    });
    if (!Summoner) {
        return res.status(403).json({errors: ["Summoner does not exist"]});
    }

    res.status(200).json(Summoner)
});


export const updateSummoner: RequestHandler<{}> = async (
    req,
    res
) => {

    const region = req.query.region as string;
    const name = req.query.summonerName as string;
    try {
        const findSummoner = await DI.summonerRepository.findOne({
            name: name,
            region: region,
        }, {populate: ["queues", "matches", "matches.evaluations", "users"]})

        if (!findSummoner) {
            return res.status(403).json({errors: ["Summoner doest not exist"]});
        }

        let updatedSummoner = await createSummoner(region, name);

        findSummoner.summonerLevel = updatedSummoner.summonerLevel;
        findSummoner.profileIconId = updatedSummoner.profileIconId;

        //DELETE OLD QUEUES
        for (const findSummonerQueue of findSummoner.queues) {
            await DI.summonerRepository.removeAndFlush(findSummonerQueue);
        }

        //ADD NEW QUEUES
        for (const updatedSummonerQueue of updatedSummoner.queues) {
            findSummoner.queues.add(updatedSummonerQueue);
        }
        //ADD NEW MATCHES
        for (const updatedSummonerMatch of updatedSummoner.matches) {
            findSummoner.matches.add(updatedSummonerMatch);
        }

        wrap(findSummoner).assign(findSummoner);
        await DI.summonerRepository.persistAndFlush(findSummoner);

        res.json(findSummoner);
    } catch (e: any) {
        return res.status(400).json({errors: [e.message]});
    }
}
