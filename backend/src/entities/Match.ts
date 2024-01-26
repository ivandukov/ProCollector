import {Collection, Entity, ManyToMany, OneToMany, PrimaryKey,} from "@mikro-orm/core";
import {object, string} from "yup";
import {Summoner} from "./index";
import {Evaluation} from "./Evaluation";

@Entity()
export class Match {

    @PrimaryKey({type: 'text'})
    id: string;

    @ManyToMany(() => Summoner, (e) => e.matches)
    summoners = new Collection<Summoner>(this);


    @OneToMany(() => Evaluation, evaluation => evaluation.matchId)
    evaluations = new Collection<Evaluation>(this);


    constructor({id}: AddMatchDTO) {
        this.id = id;
    }
}

export const MatchSchema = object({
    id: string().required()
});

export type AddMatchDTO = {
    id: string;
};