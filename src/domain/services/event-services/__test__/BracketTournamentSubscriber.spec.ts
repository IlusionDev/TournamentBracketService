import 'reflect-metadata';
import BracketTournamentSubscriberService from "../BracketTournamentSubscriberService";
import BracketTournamentEvents from "../../../../events/BracketTournamentEvents";
import RoundRepository from "../../../repositories/RoundRepository";
import BracketTournamentRepository from "../../../repositories/BracketTournamentRepository";
import RoundService  from "@/domain/services/RoundService";

const roundMockService = {
    createRoundAndMatches: jest.fn()
}
jest.mock("@/domain/services/RoundService", () => jest.fn(() => roundMockService))

const players = [{
    id: "testId"
}, {
    id: "testId"
}]

const bracket = {
    matchSize: 2,
    players: new Promise(resolve => resolve(players)),
    matches: new Promise(resolve => resolve([])),
}

const roundMock = {
    matches: new Promise(resolve => resolve([{
        id: "testId",
        winner: {
            id: "testId"
        }
    }])),
    players: new Promise(resolve => resolve(players)),
}

const brackeTournamentMockRepository = {
    findOne: jest.fn(() => new Promise((resolve) => resolve(bracket))),
    save: jest.fn((data) => new Promise((resolve) => resolve(data)))
}

// @ts-ignore
BracketTournamentRepository.getRepository = jest.fn(() => brackeTournamentMockRepository)

const roundMockRepository = {
    findOne: jest.fn(() => new Promise((resolve) => resolve(roundMock)))
}

// @ts-ignore
RoundRepository.getRepository = jest.fn(() => roundMockRepository)

const bracketTournamentSubscriber = new BracketTournamentSubscriberService();
const bracketEventsMock = {
    tournamentFinished: jest.fn()
}
// @ts-ignore
const bracketEvents = BracketTournamentEvents.getInstance = jest.fn(() => bracketEventsMock)

describe("BracketTournamentSubscriber", () => {

    it("start a bracket", async () => {
        await bracketTournamentSubscriber.startBracketTournament("test")

        expect(brackeTournamentMockRepository.findOne).toHaveBeenNthCalledWith(1, "test");
        expect(roundMockService.createRoundAndMatches).toHaveBeenNthCalledWith(1, bracket, players);
    });

    it("finish a bracket", async () => {
        await bracketTournamentSubscriber.tournamentFinish({
            lastRound: "test",
            bracketTournamentId: "testId"
        })

        expect(roundMockRepository.findOne).toHaveBeenNthCalledWith(1, "test");
        expect(bracketEventsMock.tournamentFinished).toHaveBeenNthCalledWith(1, {
            bracketTournamentId: "testId",
            winnerId: "testId"
        });
    });
});
