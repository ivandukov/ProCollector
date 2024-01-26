import {Entity, ManyToOne, PrimaryKey, Property,} from "@mikro-orm/core";
import {object, string} from "yup";
import {v4} from "uuid";
import {Match} from "./Match";

@Entity()
export class Evaluation {

    @PrimaryKey()
    id: string = v4();

    @Property({type: 'text'})
    lane: string;

    @Property({type: 'text'})
    description: string;

    @Property({type: 'text'})
    summonerName: string;

    @Property({type: 'text'})
    tag: string;

    @Property({type: 'text'})
    feedback: string;


    @ManyToOne({entity: () => Match}) // or use options object
    matchId!: Match;


    constructor({lane, summonerName, description, tag, feedback}: AddEvaluationDTO) {
        this.lane = lane;
        this.summonerName = summonerName;
        this.description = description;
        this.tag = tag;
        this.feedback = feedback;
    }
}

export const EvaluationSchema = object({
    lane: string().required(),
    summonerName: string().required(),
    description: string().required(),
    tag: string().required(),
    feedback: string().required()
});

export type AddEvaluationDTO = {
    lane: string;
    summonerName: string;
    description: string;
    tag: string;
    feedback: string;
};