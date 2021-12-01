import MatchRepository from "../../repositories/MatchRepository";
import RoundRepository from "../../repositories/RoundRepository";
import PlayerRepository from "../../repositories/PlayerRepository";
import MatchService from "../MatchService";

const round = {}

const player = {
    id: "playerId",
}

const matchMockRepository = {
    create: jest.fn((data) => data),
    save: jest.fn((data) => new Promise((resolve) => resolve(data))),
    findOne: jest.fn(() => new Promise((resolve) => resolve({})))
}

const roundMockRepository = {
    findOne: jest.fn(() => new Promise((resolve) => resolve(round))),
}

const playerMockRepository = {
    findOne: jest.fn(() => new Promise((resolve) => resolve(player))),
    findByIds: jest.fn((data) => new Promise((resolve) => resolve([
        {},
        {},
    ])))
}

// @ts-ignore
const matchRepository = MatchRepository.getRepository = jest.fn(() => matchMockRepository);
// @ts-ignore
const roundRepository = RoundRepository.getRepository = jest.fn(() => roundMockRepository);
// @ts-ignore
const playerRepository = PlayerRepository.getRepository = jest.fn(() => playerMockRepository);

const matchService = new MatchService()

describe("MatchService", () => {
    it("creates match and attaches players", async () => {
        await matchService.createMatchAndMatchPlayers({
            roundId: "roundId",
            playerIds: [{}, {}] as any
        })

        const expectedModel = {
            round: {},
            players: [{}, {}] as any,
            winner: null,
        }

        expect(roundMockRepository.findOne).toHaveBeenNthCalledWith(1, "roundId")
        expect(matchMockRepository.create).toHaveBeenCalledWith(expectedModel)
        expect(matchMockRepository.save).toHaveBeenCalledWith(expectedModel)

    })

    it("sets winner", async () => {
        await matchService.setMatchWinner("matchId" as any, "playerId" as any)

        const expectedModel = {
            winner: player,
        }

        expect(matchMockRepository.save).toHaveBeenCalledWith(expectedModel)
    })
})
