# FWE-LeagueOfLegeds

## General information

The RIOT-API, which is used to access player-data has to be updated every 24 hours. A new RIOT-API-Key can be generated  <a href="https://developer.riotgames.com/">here</a> with a RIOT-Account. 

For further information of this project, please read ```backend/README.md```, ```frontend/README.md```

## Getting started

1. Make sure that a legit Riot API key is set in the RiotApi controller.
2. Run docker-compose up
3. When problems with express session -> go to api docker container and run npm install
4. The frontend is at http://localhost:3000/ and the backend is at http://localhost:4000/



## Project Management

- SCRUM
- Issues
- Kanban Board
- Milestones
- Discord

**Sprint lenght is 1 Week.**

## Guidelines 

### Docker

Everything **MUST** run in a docker environment.

### Formatting

The default formatting in PHPStorm/IntelliJ/Webstorm is going to be used. (CTRL+ALT+L)

### GIT

To ensure that everything goes to plan, every Issue must be worked on its own branch.
When the Issue is ready, then a Merge Request to the Main branch should be made, explaining what has been done.
In order to ensure QA, the Issue **must be reviewed from another another team member**, before it is going to be merged.
Please do not make Merge Request for not working features.
**Do not push to Main!** Only exception is when initializing projects or when every team member has approved this.

### Coding Guidelines

Look @ Google Coding Guidelines

https://google.github.io/styleguide/tsguide.html


Summary: 

1. Use PascalCase for type names.
2. Do not use I as a prefix for interface names.
3. Use PascalCase for enum values.
4. Use camelCase for function names.
5. Use camelCase for property names and local variables.
6. Use === , !== instead of ==
7. Try not to use the **any** Type or **//@ts-ignore**
8. Comment using JavaDoc style. 
9. Use standard .gitignore files

### Review Guidelines

As we do not have that much time, a review means looking at the pushed code and roughly check if there are problems, max 5-10 minutes.

### Testing

We will try to test as much as possible. 


