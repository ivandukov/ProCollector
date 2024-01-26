import {Entity, ManyToOne, PrimaryKey, Property,} from "@mikro-orm/core";
import {User} from "./User";
import {v4} from "uuid";
import {Guide} from "./Guide";
import {object, string} from "yup";

@Entity()
export class GuideComment {
    @PrimaryKey()
    id: string = v4();

    @Property()
    title: string;

    @Property()
    text: string;

    @ManyToOne(() => Guide, {nullable: true})
    guide?: Guide;

    @ManyToOne(() => User, {nullable: true})
    creator?: User;

    constructor({title, text, guide, creator}: CreateGuideCommentsDTO) {
        this.title = title;
        this.text = text;
        this.guide = guide;
        this.creator = creator;

    }
}

export const CreateGuideCommentsSchema = object({
    title: string().required(),
    text: string().required(),
});
export type CreateGuideCommentsDTO = {
    title: string;
    text: string;
    creator: User;
    guide: Guide;
};
