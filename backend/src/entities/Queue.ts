import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne, PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { array, object, string, number } from "yup";
import {Summoner} from "./index";
import {v4} from "uuid";

@Entity()
export class Queue {

  @PrimaryKey({ type: 'text' })
  id: string = v4();

  @Property({ type: 'text' })
  queueType: string;

  @Property({ type: 'text' })
  tier: string;

  @Property({ type: 'text' })
  rank: string;

  @Property({ type: 'int' })
  leaguePoints: number;

  @Property({ type: 'int' })
  wins: number;

  @Property({ type: 'int' })
  losses: number;

  @ManyToOne({ entity: () => Summoner }) // or use options object
  summoner!: Summoner;


  constructor({queueType, tier, rank, leaguePoints,  wins, losses}: AddQueueDTO) {
    this.queueType = queueType;
    this.tier = tier;
    this.rank = rank;
    this.leaguePoints = leaguePoints;
    this.wins = wins;
    this.losses = losses;
  }
}

export const QueueSchema = object({
  queueType: string().required(),
  tier: string().required(),
  rank: string().required(),
  leaguePoints: number().integer().required(),
  wins: number().integer().required(),
  losses: number().integer().required(),
});

export type AddQueueDTO = {
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
}