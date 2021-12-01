import MatchRepository from "../../repositories/MatchRepository";
import PlayerRepository from "../../repositories/PlayerRepository";
import {MatchStatsService} from "../MatchStatsService";
import MatchStatsRepository from "../../repositories/MatchStatsRepository";
import MatchEvents from "../../../events/MatchEvents";

const round = {
    finished: false,
}

const player = {
    id: "playerId",
}

const match = {
    id: "matchId",
    round: round,
    players: [player],
}

const matchStatsMockRepository = {
    findOne: jest.fn(() => new Promise((resolve) => resolve({
        match,
    }))),
    create: jest.fn((data) => data),
    save: jest.fn((data) => new Promise((resolve) => resolve(data))),
}

const matchMockRepository = {
    create: jest.fn((data) => data),
    save: jest.fn((data) => new Promise((resolve) => resolve(data))),
    findOne: jest.fn(() => new Promise((resolve) => resolve({})))
}

const playerMockRepository = {
    findOne: jest.fn(() => new Promise((resolve) => resolve(player))),
    findByIds: jest.fn((data) => new Promise((resolve) => resolve([
        {},
        {},
    ])))
}

const matchEventsMock = {
    statsUpdated: jest.fn()
}

// @ts-ignore
const matchRepository = MatchRepository.getRepository = jest.fn(() => matchMockRepository);
// @ts-ignore
const playerRepository = PlayerRepository.getRepository = jest.fn(() => playerMockRepository);
// @ts-ignore
const matchStatsRepository = MatchStatsRepository.getRepository = jest.fn(() => matchStatsMockRepository);
// @ts-ignore
const matchEvents = MatchEvents.getInstance = jest.fn(() => matchEventsMock);

const matchStatsService = new MatchStatsService()

describe("MatchStatsService", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("check if match have stats", async () => {
        const haveStats = await matchStatsService._haveMatchStatsInMatch(player as any, match as any)

        expect(matchStatsMockRepository.findOne).toHaveBeenNthCalledWith(1, {
            where: {
                player,
                match
            }
        })
        expect(haveStats).toEqual(true)
    });

    it("saves the first stat of a player in a match", async () => {
        const saveMatchStatsDto = {
            matchId: "matchId",
            playerId: "playerId",
            points: 2
        }
        const expectedSavedModel = {
            match: {},
            player,
            points: 2
        }
        // @ts-ignore
        matchStatsService._createMatchStatsConditions = jest.fn(() => true)
        const savedModel = await matchStatsService.saveMatchStats(saveMatchStatsDto)

        expect(matchMockRepository.findOne).toHaveBeenNthCalledWith(1, "matchId")
        expect(playerMockRepository.findOne).toHaveBeenNthCalledWith(1, "playerId")
        expect(matchStatsMockRepository.create).toHaveBeenNthCalledWith(1, expectedSavedModel)
        expect(matchStatsMockRepository.save).toHaveBeenNthCalledWith(1, expectedSavedModel)
        expect(savedModel).toMatchSnapshot()
    });

    it("updates stat of a player in a match", async () => {
        const saveMatchStatsDto = {
            id: "matchStatsId",
            points: 23,
            finished: true
        }
        const expectedSavedModel = {
            match: {},
            player,
            points: 2
        }

        const updatedModel = await matchStatsService.updateMatchStats(saveMatchStatsDto)

        expect(matchStatsMockRepository.findOne).toHaveBeenNthCalledWith(1, "matchStatsId")
        expect(matchStatsMockRepository.save).toHaveBeenNthCalledWith(1, {
            match,
            finished: true
        })
        expect(matchEventsMock.statsUpdated).toHaveBeenNthCalledWith(1, "matchId")
        expect(updatedModel).toMatchSnapshot()
    });
});
