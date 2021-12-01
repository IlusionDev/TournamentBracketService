import BracketTicketService from "../BracketTicketService";
import BracketTournamentRepository from "../../repositories/BracketTournamentRepository";
import PlayerRepository from "../../repositories/PlayerRepository";


const bracketTicketSerivce = new BracketTicketService()
const isBracketFull = jest.fn(() => false)
const getBracketPlayerById = jest.fn(() => new Promise(resolve => resolve(true)))
jest.mock('@/domain/repositories/BracketTournamentRepository', () => jest.fn(() => ({
    getBracketPlayerById
})))

jest.mock("@/domain/services/BracketService", () => jest.fn(() => ({
    isBracketFull
})))

const bracket = {
    id: "bracketId",
    price: 10,
    finished: false,
    players: Promise.resolve([{
        id: "playerId",
    }])
}
const player = {
    id: "playerId",
    balance: 200
}
const bracketTournamentRepository = {
    findOne: jest.fn(() => new Promise(resolve => resolve(bracket))),
    save: jest.fn(() => new Promise(resolve => resolve(bracket)))
}
const playerRepository = {
    findOne: jest.fn(() => new Promise(resolve => resolve(player))),
    update: jest.fn(() => new Promise(resolve => resolve(player)))
}

// @ts-ignore
BracketTournamentRepository.getRepository = jest.fn(() => bracketTournamentRepository)
// @ts-ignore
PlayerRepository.getRepository = jest.fn(() => playerRepository)

describe("BracketTicketService", () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("should check if has already a ticket", () => {
        const hasTicket = bracketTicketSerivce._hasAlreadyTicket("playerId", "bracketId")

        expect(getBracketPlayerById).toHaveBeenNthCalledWith(1, "playerId", "bracketId")
    });

    it("check if can afford a ticket", () => {
        const canAffordTicket = bracketTicketSerivce._canAffordTicket({
            price: 10
        }, {
            balance: 10
        })

        expect(canAffordTicket).toEqual(true)
    });

    it("can not buy a ticket", async () => {
        const canBuyTicket = await bracketTicketSerivce._canBuyTicket({
            id: "bracketTicketId",
            price: 10
        }, {
            id: "playerId",
            balance: 10
        })

        expect(canBuyTicket).toEqual(false)
    });

    it("can buy a ticket and check conditons", async () => {
        bracketTicketSerivce._canAffordTicket = jest.fn().mockReturnValue(true)
        bracketTicketSerivce._canBuyTicket = jest.fn().mockReturnValue(true)
        const canBuyTicket = await bracketTicketSerivce._checkBuyConditions({
            id: "bracketId",
            price: 10,
            finished: false

        }, {
            id: "playerId",
            balance: 10
        })

        expect(bracketTicketSerivce._canAffordTicket).toHaveBeenCalled()
        expect(bracketTicketSerivce._canBuyTicket).toHaveBeenCalled()
        expect(isBracketFull).toHaveBeenCalled()
    });

    it("try to buy a ticket", async () => {
        bracketTicketSerivce._canAffordTicket = jest.fn().mockReturnValue(true)
        bracketTicketSerivce._canBuyTicket = jest.fn().mockReturnValue(true)

        await bracketTicketSerivce.buyBracketTournamentTicket({
            bracketId: "bracketId",
            playerId: "playerId"
        })


        expect(bracketTournamentRepository.findOne).toHaveBeenNthCalledWith(1, "bracketId")
        expect(playerRepository.findOne).toHaveBeenNthCalledWith(1, "playerId")
        expect(playerRepository.update).toHaveBeenNthCalledWith(1, player, {"balance": 190})
        expect(bracketTournamentRepository.save).toHaveBeenNthCalledWith(1, {
            ...bracket,
            players: [{
                id: "playerId"
            },
                {
                    "balance": 200,
                    "id": "playerId",
                }
            ]
        })
    });


});
