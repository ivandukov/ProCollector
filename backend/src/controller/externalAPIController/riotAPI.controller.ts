import {Request, RequestHandler, Response} from "express";

process.env.LEAGUE_API_KEY = 'apikey' // need to be change every 24h
const LeagueJS = require('leaguejs');

/**
 *
 * @param region
 * @param summonerName
 */
export const leagueJsSummonerByName = async (region: string, summonerName: string) => {


  const leagueJs = new LeagueJS(process.env.LEAGUE_API_KEY, {PLATFORM_ID: region}, {limits: {allowBurst: true}},
      {
        caching: {
          isEnabled: true, // enable basic caching
          defaults: {stdTTL: 120} // add a TTL to all Endpoints you think is appropriate (you can tune it later per Endpoint)
        }
      }
  );
  console.log(leagueJs);

  leagueJs.updateRateLimiter({allowBursts: true});
  const summoner = await leagueJs.Summoner.gettingByName(summonerName)
  .catch((err: any) => {
    console.log(err);
    return ({errors: "Summoner not found (check API key)"});
  });

  if (summoner.errors) {
    return summoner;
  }

  const queues = await leagueJs.League.gettingEntriesForSummonerId(summoner.id)
  .catch((err: any) => {
    console.log(err);
    return ({errors: "entries not found"});
  });
  let filteredQueues = [];

  for (const queue of queues) {
    if (queue.queueType == "RANKED_FLEX_SR" || queue.queueType == "RANKED_SOLO_5x5") {
      filteredQueues.push(queue);
    }
  }


  const matches = await leagueJs.Match.gettingMatchIdsByPuuid(summoner.puuid, region, {type: 'ranked'})//Query parameter 'type' must be one of [ranked, normal, tourney, tutorial].
  .catch((err: any) => {
    console.log(err);
    return ({errors: "matches not found"});
  });
  if (matches.errors) {
    return matches;
  }

  return {
    id: summoner.id,
    puuid: summoner.puuid,
    name: summoner.name,
    profileIconId: summoner.profileIconId,
    summonerLevel: summoner.summonerLevel,
    region: region,
    queues: filteredQueues,
    matches: matches
  };

}

/**
 *
 *
 * @param req
 * @param res
 */
export const getSummonerByName = async (
    req: Request,
    res: Response
) => {

  //TODO: change req.param('summonerName') &&  req.param('region')
  const region = req.query.region as string;
  const summonerName = req.query.summonerName as string;
  const newSummoner = await leagueJsSummonerByName(region, summonerName);

  if (!newSummoner.errors) {
    res.status(200).json(newSummoner);
  } else {
    res.status(400).json(newSummoner);
  }

}


export const leagueJsMatchDataTimelineById = async (region: string, matchId: string) => {

  const leagueJs = new LeagueJS(process.env.LEAGUE_API_KEY, {PLATFORM_ID: region});
  return await leagueJs.Match.gettingTimelineById(matchId)
  .catch((err: any) => {
    console.log(err);
    return ({errors: "matchId not found (check API key)"});
  });

}

export const leagueJsMatchDataById = async (region: string, matchId: string) => {

  const leagueJs = new LeagueJS(process.env.LEAGUE_API_KEY, {PLATFORM_ID: region});
  const matchData = await leagueJs.Match.gettingById(matchId)
  .catch((err: any) => {
    console.log(err);
    return ({errors: "matchId not found (check API key)"});
  });
  if (matchData.errors) {
    return matchData;
  }

  let newParticipants: any[] = [];
  for (let i = 0; i < matchData.info.participants.length; i++) {

    let participant = {
      //not in openapispec
      puuid: matchData.metadata.participants[i],
      participantId: i + 1,
      //
      summonerName: matchData.info.participants[i].summonerName,
      teamId: matchData.info.participants[i].teamId,
      teamPosition: matchData.info.participants[i].teamPosition,
      championName: matchData.info.participants[i].championName,
      kills: matchData.info.participants[i].kills,
      assists: matchData.info.participants[i].assists,
      deaths: matchData.info.participants[i].deaths,
      totalDamageDealtToChampions: matchData.info.participants[i].totalDamageDealtToChampions,
      totalMinionsKilled: matchData.info.participants[i].totalMinionsKilled,
      ////not in openapispec
      visionScorePerMinute: matchData.info.participants[i].challenges?.visionScorePerMinute | 0,
      goldPerMinute: matchData.info.participants[i].challenges?.kda | 0,
      goldEarned: matchData.info.participants[i].goldEarned,
      controlWardsPlaced: matchData.info.participants[i].challenges?.controlWardsPlaced | 0,
      skillshotsDodged: matchData.info.participants[i].challenges?.skillshotsDodged | 0,
      skillshotsHit: matchData.info.participants[i].challenges?.skillshotsHit | 0,
      kda: matchData.info.participants[i].challenges?.kda | 0,
      soloKills: matchData.info.participants[i].challenges?.soloKills | 0,
      visionScore: matchData.info.participants[i].visionScore,
      tripleKills: matchData.info.participants[i].tripleKills,
      quadraKills: matchData.info.participants[i].quadraKills,
      pentaKills: matchData.info.participants[i].pentaKills,
      //
      item0: matchData.info.participants[i].item0,
      item1: matchData.info.participants[i].item1,
      item2: matchData.info.participants[i].item2,
      item3: matchData.info.participants[i].item3,
      item4: matchData.info.participants[i].item4,
      item5: matchData.info.participants[i].item5,
      item6: matchData.info.participants[i].item6,
      win: matchData.info.participants[i].win,
    }
    newParticipants.push(participant);
  }

  let newTeams: any[] = [];
  for (const team of matchData.info.teams) {
    let newBans: any[] = [];
    for (const ban of team.bans) {
      let newBan = {
        championId: ban.championId
      }
      newBans.push(newBan);
    }
    let newTeam = {
      teamId: team.teamId,
      bans: newBans
    }
    newTeams.push(newTeam);
  }

  return ({
    matchId: matchData.metadata.matchId,
    gameCreation: matchData.info.gameCreation,
    gameDuration: matchData.info.gameDuration,
    participants: newParticipants,
    teams: newTeams
  })


}


export const getMatchDataById: RequestHandler<{}> = async (
    req,
    res
) => {
  const region = req.query.region as string;
  const matchId = req.query.matchId as string;

  let matchData = await leagueJsMatchDataById(region, matchId);

  console.log(matchData);

  if (!matchData.errors) {
    res.status(200).json(matchData);
  } else {
    res.status(400).json(matchData);
  }

}











