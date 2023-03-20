import {MatchData, Participant} from "../adapter/api/__generated";

export type NormalizedMatchData = {
    duration: number;
    matchDate: string;
    me: Participant | null;
    kills: number;
    deaths: number;
    assists: number;
    isMatchWon: string;
    hero: string;
    kdaRatio: string;
    items: number[];
    ourTeam: Participant[];
    theirTeam: Participant[];
}


export function findMe(matchData: MatchData, inputMe: string): Participant | null {

    let me: Participant | null = null;

    matchData.participants!.forEach(participant => {
        if (participant.summonerName?.toLowerCase() === inputMe.toLowerCase()) {
            me = participant;
        }
    });

    return me;
}

export const matchInfoNormalizer = (matchData: MatchData, inputMe: string) => {

    const matchDate = new Date(matchData!.gameCreation!).toDateString();
    const duration = Math.floor(Number(matchData.gameDuration) / 60);
    let me: Participant | null = null;
    let ourTeam: Participant[] = [];
    let theirTeam: Participant[] = [];


    me = findMe(matchData, inputMe);
    if (me === null) {
        return null;
    }

    matchData.participants!.forEach(participant => {
        if (participant.win === me?.win) {
            ourTeam.push(participant);
        } else {
            theirTeam.push(participant);
        }
    });

    let kills: number = me!.kills!;
    let deaths: number = me!.deaths!;
    let assists: number = me!.assists!;
    let isMatchWon: string = me!.win! ? "Won" : "Lost";
    let hero: string = me!.championName!;
    let kdaRatio: string = ((kills + assists) / deaths).toFixed(2);
    let items: number[] = [
        me!.item0!,
        me!.item1!,
        me!.item2!,
        me!.item3!,
        me!.item4!,
        me!.item5!,
        me!.item6!,
    ]

    let normalizedMatchData: NormalizedMatchData = {
        duration,
        matchDate,
        me,
        kills,
        deaths,
        assists,
        isMatchWon,
        hero,
        kdaRatio,
        items,
        ourTeam,
        theirTeam,
    }

    return normalizedMatchData;
}
