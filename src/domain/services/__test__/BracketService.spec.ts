import BracketTournamentRepository from "../../repositories/BracketTournamentRepository";
import BracketService from "../BracketService";

const bracketDto = {
  price: 10,
  reward: 1000,
  ticketSlots: 32,
};

const bracket = {
  id: "bracketId",
  price: 10,
  reward: 1000,
  ticketSlots: 32,
};

const bracketTournamentRepository = {
  create: jest.fn((data) => data),
  save: jest.fn((data) => new Promise((resolve) => resolve(data))),
  findOne: jest.fn(() => new Promise((resolve) => resolve(bracket))),
  update: jest.fn(
    () => new Promise((resolve) => resolve({ ...bracket, reward: 2000 }))
  ),
};

// @ts-ignore
BracketTournamentRepository.getRepository = jest.fn(
  () => bracketTournamentRepository
);

const bracketService = new BracketService();

describe("BracketService", () => {
  it("creates a bracket", async () => {
    const modelSaved = await bracketService.createBracket(bracketDto as any);
    const expectedModel = {
      finished: false,
      price: 10,
      reward: 1000,
      ticketSlots: 32,
    };

    expect(bracketTournamentRepository.create).toHaveBeenNthCalledWith(
      1,
      expectedModel
    );
    expect(bracketTournamentRepository.save).toHaveBeenNthCalledWith(
      1,
      modelSaved
    );
    expect(modelSaved).toEqual(expectedModel);
  });

  it("update a bracket", async () => {
    const expectedUpdatedModel = {
      id: "bracketId",
      reward: 2000,
    };

    const modelUpdated = await bracketService.updateBracket(
      expectedUpdatedModel as any
    );

    expect(bracketTournamentRepository.findOne).toHaveBeenNthCalledWith(1, {
      where: { id: "bracketId" },
    });
    expect(bracketTournamentRepository.update).toHaveBeenNthCalledWith(
      1,
      "bracketId",
      expectedUpdatedModel
    );
    expect(modelUpdated).toMatchInlineSnapshot(`
      Object {
        "id": "bracketId",
        "price": 10,
        "reward": 2000,
        "ticketSlots": 32,
      }
    `);
  });
});
