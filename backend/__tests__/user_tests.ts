import 'supertest';
import supertest = require("supertest");
import app, { init } from "../src/index";
import {DI} from "../src";

let Cookies : string;
let guideId: string;
let guideTitle: string;
beforeAll(async ()=>{
  await init()
})

afterAll(async ()=>{
  await DI.orm.getSchemaGenerator().dropSchema();
  await DI.orm.close(true);
})

/**
 * test register
 */

it('test register user without userName',async ()=>{
  const response = await supertest(app).post('/auth/register').send({lastName: "taibi",
    password: "123456",summonerName: "ninox23",region: "euw1"});
  expect(response.statusCode).toBe(400);
  expect(response.body).toEqual({"errors": ["userName is a required field"]});
})
it('test register user without summonerName',async ()=>{
  const response = await supertest(app).post('/auth/register').send({userName: "test1",password: "123456",region: "euw1"});
  expect(response.statusCode).toBe(400);
  expect(response.body).toEqual({"errors": "summoner not found"});
})
it('test register new user',async ()=>{
  const response = await supertest(app).post('/auth/register').send({userName: "test1",password: "123456",summonerName: "ninox23",region: "euw1"});
  expect(response.statusCode).toBe(201);
  expect(response.body.userName).toBe("test1");
  expect(response.body.summonerName.name).toBe("ninox23");
})

it('test register existing  user',async ()=>{
  const response = await supertest(app).post('/auth/register').send({userName: "test1",password: "123456",summonerName: "ninox23",region: "euw1"});
  expect(response.statusCode).toBe(400);
  expect(response.body).toEqual({"errors": ["user already exists"]});
})
/**
 * test login
 */
it('test login user', async ()=>{
  const response =  await supertest(app).post('/auth/login').send({
    userName: "test1",
    password: "123456"
  });
  Cookies = response.headers['set-cookie'].pop().split(';')[0];
  expect(response.statusCode).toBe(200);
  expect(response.body.User.userName).toBe("test1");
})

it('test login without password',async ()=>{
  const response = await supertest(app).post('/auth/login').send({userName : 'test1'});
  expect(response.statusCode).toBe(400);
  expect(response.body).toEqual({"errors": ["password is a required field"]});
})

it('test login without userName', async ()=>{
  const response = await supertest(app).post('/auth/login').send({
    "password": "123456"
  });
  expect(response.statusCode).toBe(400);
  expect(response.body).toEqual({"errors": ["userName is a required field"]});
})
/**
 * test guides
 */
it('test get all guides with out access',async ()=>{
  const response = await supertest(app).get('/guides');
  expect(response.body).toEqual({"errors": ["you dont have access"]});
})

it('test get all guides',async ()=>{
  const response = await supertest(app).get('/guides').set("Cookie",Cookies);
  expect(response.body).toEqual([]);
})

it('test add a guide',async ()=>{
  const response = await supertest(app).post('/guides').send(  {
    "title": "string",
    "text": "string"
  }).set("Cookie",Cookies);
  guideId=response.body.id;
  guideTitle=response.body.title;
  expect(response.body.title).toBe("string");
  expect(response.body.text).toBe("string");
})

it('test get a guide with Title',async ()=>{
  const response = await supertest(app).get('/guides/title/' + guideTitle).set("Cookie",Cookies);
  expect(response.statusCode).toBe(200);
  expect(response.body.title).toBe("string");
  expect(response.body.text).toBe("string");
})

it('test modify a guide',async ()=>{
  const response = await supertest(app).put('/guides/' + guideId).send(  {
    "title": "neu string",
    "text": "neu string"
  }).set("Cookie",Cookies);
  expect(response.statusCode).toBe(200);
  expect(response.body.title).toBe("neu string");
  expect(response.body.text).toBe("neu string");
})

it('test add a comment to a guide',async ()=>{
  const response = await supertest(app).post('/guidecomments/'+ guideId).send(  {
    "title": "string",
    "text": "string"
  }).set("Cookie",Cookies);
  expect(response.statusCode).toBe(200);
  expect(response.body.title).toBe("string");
  expect(response.body.text).toBe("string");
})
it('test delete a guide',async ()=>{
  const response = await supertest(app).delete('/guides/' + guideId).set("Cookie",Cookies);
  expect(response.statusCode).toBe(204);
})







