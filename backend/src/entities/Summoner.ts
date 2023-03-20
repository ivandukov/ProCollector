import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany, OneToOne, PrimaryKey,
  Property,
} from "@mikro-orm/core";
import {Match, Queue, User} from "./index";
import {object, string, number} from "yup";
import {Follower} from "./Follower";

@Entity()
export class Summoner{
  @PrimaryKey({ type: 'text' })
  id: string;

  @Property({ type: 'text' })
  puuid: string;

  @Property({ type: 'text' })
  name: string;

  @Property({ type: 'int' })
  profileIconId: number;

  @Property({ type: 'long' })
  summonerLevel: number;

  @Property({ type: 'text' })
  region: string;

  @OneToMany(() => Queue, queue => queue.summoner)
  queues = new Collection<Queue>(this);

  @ManyToMany(() => Match)
  matches = new Collection<Match>(this);

  // two different implementation from two different developers?!
  @OneToMany(() => User, user => user.summonerName)
  users = new Collection<User>(this);

  /*@OneToOne(() => Follower, follower => follower.summonerFollower)
  summonerFollower!: Follower;
*/

  constructor({ id, puuid, name,profileIconId, summonerLevel, region }: AddSummonerDTO) {
    this.id = id;
    this.puuid = puuid;
    this.name = name;
    this.profileIconId = profileIconId;
    this.summonerLevel = summonerLevel;
    this.region = region;
  }
}

export const SummonerSchema = object({
  id: string().required(),
  puuid: string().required(),
  name: string().required(),
  profileIconId: number().integer().required(),
  summonerLevel: number().required(),
  region: string().required()
});

export type AddSummonerDTO = {
  id: string;
  puuid: string;
  name: string;
  profileIconId: number;
  summonerLevel: number;
  region: string;
};