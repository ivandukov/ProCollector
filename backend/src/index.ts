import express, {RequestHandler} from 'express'
import cors from "cors";
import {EntityManager, EntityRepository, MikroORM, RequestContext,} from "@mikro-orm/core";
import http from "http";
import {Evaluation, Follower, Guide, GuideComment, Match, Queue, Summoner, User} from "./entities";
import {AuthController} from "./controller/auth.controller";
import session from "express-session";
import {globalRouter} from "./router/global.router";
import {riotAPIRouter} from "./router/riotAPI.router";
import {evaluationRouter} from "./router/evaluation.router";
import {summonerRouter} from "./router/summoner.router";
import {guidePublicRouter} from "./router/guides-public.router";

export const DI = {} as {
    server: http.Server;
    orm: MikroORM;
    em: EntityManager;
    userRepository: EntityRepository<User>;
    guideRepository: EntityRepository<Guide>;
    guideCommentRepository: EntityRepository<GuideComment>
    summonerRepository: EntityRepository<Summoner>;
    queueRepository: EntityRepository<Queue>;
    matchRepository: EntityRepository<Match>;
    followerRepository: EntityRepository<Follower>;
    evaluationRepository: EntityRepository<Evaluation>;
};

const app = express();
export const init = async () => {

    DI.orm = await MikroORM.init();
    DI.em = DI.orm.em;
    DI.userRepository = DI.orm.em.fork().getRepository(User);
    DI.summonerRepository = DI.orm.em.fork().getRepository(Summoner);
    DI.queueRepository = DI.orm.em.fork().getRepository(Queue);
    DI.matchRepository = DI.orm.em.fork().getRepository(Match);
    DI.followerRepository = DI.orm.em.fork().getRepository(Follower);
    DI.queueRepository = DI.orm.em.getRepository(Queue);
    DI.guideRepository = DI.orm.em.fork().getRepository(Guide);
    DI.guideCommentRepository = DI.orm.em.fork().getRepository(GuideComment);
    DI.evaluationRepository = DI.orm.em.fork().getRepository(Evaluation);
    await DI.orm.getSchemaGenerator().updateSchema();
}
const corsOptions = {origin: "http://localhost:3000", credentials: true};
app.use(cors(corsOptions));

app.use(session({
        secret: 'leageueoflegeds',
        resave: false,
        saveUninitialized: false,
        cookie: {
            sameSite: 'none',
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 7,
        },
    })
)

export const verifyAccess: RequestHandler = (req, res, next) => {
    if (!req.session.cookie) {
        return res.status(401).json({errors: ["you dont have access"]});
    }
    next();
};

app.use(express.json());
app.use((req, res, next) => {
    console.log("request kam rein", req.method, req.path);
    next();
});

//TODO: refactor Authcontroller to globalRouter
app.use("/auth", AuthController);

app.use((req,
         res, next) => RequestContext.create(DI.orm.em, next));
app.use("/guides", guidePublicRouter)
app.use("/riotApi", riotAPIRouter);
app.use("/evaluation", evaluationRouter);
app.use("/summoner", summonerRouter);
app.use("/", verifyAccess, globalRouter);
app.get('/', (req, res) => {
    // res.json({ msg: 'Hallo FWE'});
    res.json({msg: "Hallo league of legends"});
})

app.listen(4000, () => {
    console.log('Server läuft auf http://localhost/4000')
});
init()
export default app;