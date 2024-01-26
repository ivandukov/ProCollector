import {Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property} from "@mikro-orm/core";
import {object, string} from "yup";
import {v4} from "uuid";
import {User} from "./User";
import {GuideComment} from "./GuideComment";

@Entity()
export class Guide {
    @PrimaryKey()
    id: string = v4();

    @Property()
    title: string;

    @Property({type: "text", length: 6000})
    text: string;

    @OneToMany(() => GuideComment, guidecomment => guidecomment.guide)
    comments = new Collection<GuideComment>(this);

    @ManyToOne({entity: () => User})
    creator!: User;


    constructor({title, text, creator}: CreateGuideDTO) {
        this.title = title;
        this.text = text;
        this.creator = creator;
    }

}

export const CreateGuideSchema = object({
    userId: string().required(),
    title: string().required(),
    text: string().required(),
});
export type CreateGuideDTOComment = Partial<Pick<GuideComment, "id" | "title" | "creator">>;

export type CreateGuideDTO = {
    title: string;
    text: string;
    creator: User;
    comments?: CreateGuideDTOComment[];
};
