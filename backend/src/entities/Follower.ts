import {Collection, Entity, ManyToMany, PrimaryKey, Property,} from "@mikro-orm/core";
import {User} from "./User";
import {number, object, string} from "yup";
import {v4} from "uuid";

@Entity()
export class Follower {

    @PrimaryKey()
    id: string = v4();

    @Property()
    followerName: string;

    @Property({type: 'int'})
    profileIconId: number;

    @ManyToMany(() => User, user => user.followers)
    users = new Collection<User>(this);

    @Property()
    region: string;

    constructor({followerName, region, profileIconId}: CreateFollowerDTO) {
        this.followerName = followerName;
        this.region = region;
        this.profileIconId = profileIconId;
    }
}

export const CreateFollowerSchema = object({
    userId: string().required(),
    followerName: string().required(),
    region: string().required(),
    profileIconId: number().integer().required()
});

export type CreateFollowerDTO = {
    followerName: string;
    region: string;
    profileIconId: number;
}
