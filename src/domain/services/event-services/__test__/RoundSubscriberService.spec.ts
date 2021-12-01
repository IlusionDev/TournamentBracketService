import RoundSubscriberService from "../RoundSubscriberService";
import BracketTournamentEvents from "../../../../events/BracketTournamentEvents";

const createRoundAndMatches = jest.fn();
const findOneMatch = jest.fn(() => new Promise(resolve => resolve(matchMock)));
const saveMatch = jest.fn(
    () => new Promise<void>((resolve) => resolve({} as any))
);
const setFinishedRound = jest.fn(() => new Promise<void>(resolve => resolve()))
const tournamentFinish = jest.fn(() => new Promise<void>(resolve => resolve()))
jest.mock("@/domain/repositories/MatchRepository", () => ({
    // @ts-ignore
    getRepository: jest.fn(() => ({
        findOne: findOneMatch,
        // @ts-ignore
        save: saveMatch,
    })),
}));
jest.mock("@/domain/services/RoundService", () => jest.fn(() => ({
    setFinishedRound,
    createRoundAndMatches,
})));
const bracketTournamentEventsMock = {
    tournamentFinish
}

// @ts-ignore
BracketTournamentEvents.getInstance = jest.fn(() => bracketTournamentEventsMock);
const bracket = {
    id: "bracketId"
}

const matchMock = {
    players: new Promise((resolve) =>
        resolve([
            {
                id: "test",
            },
        ])
    ) as any,
    ticketSlots: 32,
    price: 10,
    finished: false,
    bracket,
    round: new Promise((resolve) => resolve({
        id: "roundId",
        matches: [{
            id: "matchId",
            winner: new Promise((resolve) => resolve("winner")) as any,
        }],
        bracket: new Promise((resolve) => resolve(bracket)) as any,
    } as any)) as any,
    matchSize: new Promise((resolve) => resolve([] as any)) as any,
    id: "test",
    reward: 200,
    winner: new Promise((resolve) => resolve("winner")) as any,
};
const players = [
    {
        id: "test",
    },
] as any
const roundServiceSubscriber = new RoundSubscriberService();

describe("RoundSubscriberService", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("checks that a round is finished", async () => {
        const matches: any = [matchMock];
        const finished = await roundServiceSubscriber._roundFinished(matches);

        expect(finished).toEqual(true);
    });

    it("creates next rounds by calling RoundService", async () => {
        await roundServiceSubscriber._createNextRound(matchMock as any, players);

        // @ts-ignore
        expect(createRoundAndMatches).toHaveBeenNthCalledWith(1, matchMock, players);
    });

    it("checks if is last round and have a winner", async () => {
        const isLastRound = await roundServiceSubscriber._isLastRoundAndHaveAWinner([matchMock] as any);

        // @ts-ignore
        expect(isLastRound).toEqual(true);
    });

    it("react to match updated and set to finish a rou", async () => {
        await roundServiceSubscriber.roundMatchUpdated("matchId");

        expect(findOneMatch).toHaveBeenNthCalledWith(1, "matchId");
        expect(setFinishedRound).toHaveBeenNthCalledWith(1, {roundId: 'roundId'});
        expect(tournamentFinish).toHaveBeenNthCalledWith(1, {
            "bracketTournamentId": "bracketId",
            "lastRound": "roundId"
        });
    });
});
