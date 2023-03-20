import {Collection, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property} from "@mikro-orm/core";
import {v4} from "uuid";
import {object, string} from "yup";
import {Follower} from "./Follower";
import {Summoner} from "./Summoner";
import {Guide} from "./Guide";

@Entity()
export class User {

    @PrimaryKey()
    id: string = v4();

    @Property()
    userName: string;

    @Property({hidden: true})
    password: string;

    @ManyToMany(() => Follower)
    followers: Collection<Follower> = new Collection<Follower>(this);

    @ManyToOne({entity: () => Summoner}) // or use options object
    summonerName!: Summoner;

    @OneToMany(() => Guide, guide => guide.creator)
    guides = new Collection<Guide>(this);

    constructor({userName, password}: RegisterUserDTO) {
        this.userName = userName;
        this.password = password;
    }
}

export const RegisterUserSchema = object({
    userName: string().required(),
    password: string().required(),
});

export type RegisterUserDTO = {
    userName: string;
    password: string;
};