import RoundService from "../RoundService";
import BracketTournamentRepository from "../../repositories/BracketTournamentRepository";
import RoundRepository from "../../repositories/RoundRepository";

const createMatchAndMatchPlayers = jest.fn(() => new Promise(resolve => resolve({})));

jest.mock("@/domain/services/MatchService", () => jest.fn(() => ({
    createMatchAndMatchPlayers
})))

const bracket = {
    id: "bracketId",
}
const round = {
    finished: false,
    id: "roundId"
}

const matchEventsMock = {
    statsUpdated: jest.fn()
}

const bracketTournamentRepositoryMock = {
    findOne: jest.fn(() => new Promise((resolve) => resolve(bracket)))
}
const roundMockRepository = {
    create: jest.fn((data) => data),
    save: jest.fn((data) => new Promise((resolve) => resolve(data))),
    findOne: jest.fn(() => new Promise((resolve) => resolve(round)))
}


// @ts-ignore
BracketTournamentRepository.getRepository = jest.fn(() => bracketTournamentRepositoryMock)
// @ts-ignore
RoundRepository.getRepository = jest.fn(() => roundMockRepository)


const roundService = new RoundService()

describe("RoundService", () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('creates a new round', async function () {
        await roundService.createRound({
            bracketId: "bracketId",
        })

        expect(bracketTournamentRepositoryMock.findOne).toHaveBeenNthCalledWith(1, {
            where: {
                id: "bracketId"
            }
        })
        expect(roundMockRepository.create).toHaveBeenNthCalledWith(1, {
            bracket,
            finished: false,
        })
    })

    it('set as finished a round', async function () {
        await roundService.setFinishedRound({
            roundId: "roundId",
        })

        expect(roundMockRepository.findOne).toHaveBeenNthCalledWith(1, {
            where: {
                id: "roundId"
            }
        })
        expect(roundMockRepository.save).toHaveBeenNthCalledWith(1, {
            finished: true,
            id: "roundId",
    })
    })

    it('creates next round matches', async function () {
        const matches = await roundService._createNextRoundMatches(2, round as any, [{
            id: "playerId1",
        }, {
            id: "playerId2",
        }] as any)

        expect(createMatchAndMatchPlayers).toHaveBeenNthCalledWith(1, {"playerIds": ["playerId1", "playerId2"], "roundId": "roundId"})
        expect(matches).toMatchSnapshot()
    })

})
