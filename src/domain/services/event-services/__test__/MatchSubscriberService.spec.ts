import "reflect-metadata";
import MatchSubscriberService from "../MatchSubscriberService";
import MatchRepository from "../../../repositories/MatchRepository";
import MatchStatsRepository from "../../../repositories/MatchStatsRepository";

const matchMock = {
  players: new Promise((resolve) =>
    resolve([
      {
        id: "test",
      },
    ])
  ),
};

const findOneMatch = jest.fn(
  () => new Promise((resolve) => resolve(matchMock))
);
const saveMatch = jest.fn(
  () => new Promise<void>((resolve) => resolve({} as any))
);
jest.mock("@/domain/repositories/MatchRepository", () => ({
  // @ts-ignore
  getRepository: jest.fn(() => ({
    findOne: findOneMatch,
    // @ts-ignore
    save: saveMatch,
  })),
}));

const getAllMatchStatsByMatch = jest.fn(
  async () =>
    new Promise((resolve) =>
      resolve([
        // @ts-ignore
        {
          id: "test",
          finished: true,
        },
      ])
    )
);
const getMatchStatsRepository = jest.fn(() => ({
  findOne: jest.fn(() => new Promise((resolve) => resolve(matchMock))),
}));
// @ts-ignore
jest.mock("../../../repositories/MatchStatsRepository", () =>
  jest.fn(() => ({
    getAllMatchStatsByMatch,
    getMatchStatsRepository,
  }))
);

const matchRepositoryMock = {
  getRepository: jest.fn(() => ({
    // @ts-ignore
    findOne: jest.fn(() => new Promise((resolve) => resolve(matchMock))),
  })),
};

const bracketTournamentSubscriber = new MatchSubscriberService();

describe("MatchSubscriberService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("select a winner", async () => {
    const winnerStats = await bracketTournamentSubscriber.selectMatchWinner([
      { points: 1 },
      { points: 2 },
    ] as any);

    expect(winnerStats).toMatchInlineSnapshot(`undefined`);
  });

  it("check that al stats has finished to push data", () => {
    const allStatsFinished = bracketTournamentSubscriber.allStatsFinished([
      {
        points: 1,
        finished: true,
      },
      {
        points: 2,
        finished: true,
      },
    ] as any);

    expect(allStatsFinished).toBe(true);
  });

  it("finish the match and selects a winner", async () => {
    await bracketTournamentSubscriber.statsUpdated("testId");

    expect(
      new MatchStatsRepository().getAllMatchStatsByMatch
    ).toHaveBeenCalledWith("testId", ["test"]);
    expect(MatchRepository.getRepository().save).toMatchInlineSnapshot(`
      [MockFunction] {
        "calls": Array [
          Array [
            Object {
              "players": Promise {},
              "winner": undefined,
            },
          ],
        ],
        "results": Array [
          Object {
            "type": "return",
            "value": Promise {},
          },
        ],
      }
    `);
  });
});
