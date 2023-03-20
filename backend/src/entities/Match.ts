import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne, OneToMany, PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { array, object, string, number } from "yup";
import {RegisterUserDTO, Summoner} from "./index";
import {v4} from "uuid";
import {Evaluation} from "./Evaluation";

@Entity()
export class Match {

  @PrimaryKey({type: 'text'})
  id: string;

  @ManyToMany(() => Summoner, (e) => e.matches)
  summoners = new Collection<Summoner>(this);


  @OneToMany(() => Evaluation, evaluation => evaluation.matchId)
  evaluations = new Collection<Evaluation>(this);


  constructor({ id }: AddMatchDTO) {
    this.id = id;
  }
}

export const MatchSchema = object({
  id: string().required()
});

export type AddMatchDTO = {
  id: string;
};