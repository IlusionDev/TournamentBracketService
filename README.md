
# Bracket Tournament Service

A service that create registers players, create tournaments, registers in real time stats and a lot of things... And  
best of all is an almost full **event driven system.**  
This service is built with express and typeorm all together with typescript.

## Installation

Npm

npm i  
Yarn

yarn
## Environment

We use dotenv to load all env var in the project, to have a reference of available vars you can check env.sample file.

## How system works (a brief view)

When a tournament is started, a bunch of matches between players are created.

Once a match is created, the players can send its first tine stats. These stats represent the player's points in the  
match and once a time the player has finished the play, it updates the stats as finished. Each time a player updates its  
stats, the system will check if all stats of all player in the match are finished to set as finished the match.  
Each time a match is set to finished is emitted and event to notify the players the match winner at the same time is.

The platform at this point in every update stats is a waterfall of events, as below:


```  
 ┌───────────────────┐ │                   │ │   Update Stat     │ ◄──────────────────────────┐ │                   │                            │ └─────────┬─────────┘                            │ │                                      │ │                                      │ │ All stats finished                   │ │                                      │ │                                      │ ▼                                      │ ┌───────────────────┐                ┌───────────┴───────────────┐ │                   │                │                           │ │  Match finish     │                │ Create next round/matches │ │                   │                │                           │ └─────────┬─────────┘                └───────────────────────────┘ │                                      ▲ │ All matches finished                 │ ▼                                      │ ┌───────────────────┐                            │ │                   │                            │ │ Round finished    ├────────────────────────────┘ │                   │    Is not last round └─────────┬─────────┘ │ │ Last round finished │┌───────────┴───────────┐  
│                       │  
│  Torunament finished  │  
│                       │  
└───────────────────────┘  
```  

Each step have its own checks to know is ready go to next stage like:
- Are all stats of all players in the match are finished? Update stats process.
- match finished? Are all matches of the round are finished? Match finished process.

And so on...

Also, in some stages the system can emit events to notify the players, like:
- match finished? Match finished event.
- tournament finished? Tournament finished event.

## Endpoints

To test the platform, you can import a postman collection file placed in postman directory.
