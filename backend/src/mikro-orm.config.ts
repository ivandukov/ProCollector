import { Options } from "@mikro-orm/core";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import {Follower, Guide, GuideComment, User, Queue, Summoner} from "./entities";

const options: Options = {
  host: "database",
  type: "postgresql",
  entities: [User,Guide,GuideComment,Summoner,Queue,Follower],
  dbName: "dbadmin",
  password: "dbadminpassword",
  user: "dbadmin",
  highlighter: new SqlHighlighter(),
  debug: true,
};

export default options;
