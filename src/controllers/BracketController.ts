import Controller from "@/controllers/base/controller";
import BracketService from "@/domain/services/BracketService";
import BracketTicketService from "@/domain/services/BracketTicketService";
import BracketTournamentSubscriberService from "@/domain/services/event-services/BracketTournamentSubscriberService";

export class BracketController extends Controller {

    async createBracket() {
        const { ticketSlots, price, reward } = this.req.body;
        const bracketService = new BracketService();
        const savedBracket = await bracketService.createBracket({
            ticketSlots,
            price,
            reward
        })

        return this.req.apiResponse.generateAndSendWithStatus(savedBracket, {
            statusCode: 201
        });
    }

    async newBracketPlayerParticipant() {
        const { playerId, bracketId } = this.req.body;
        const bracketTicketService = new BracketTicketService();
        try {
            const savedBracket = await bracketTicketService.buyBracketTournamentTicket({
                playerId,
                bracketId
            })

            return this.req.apiResponse.generateAndSendWithStatus(savedBracket, {
                statusCode: 201
            });
        } catch (e) {
            return this.req.apiResponse.generateAndSendWithStatus(e.message, {
                statusCode: 400
            });
        }
    }

    async bracketStart() {
        const { bracketId } = this.req.body;
        const bracketTournamentSubscriberService = new BracketTournamentSubscriberService();
        try {
            const savedBracket = await bracketTournamentSubscriberService.startBracketTournament(bracketId)

            return this.req.apiResponse.generateAndSendWithStatus(savedBracket, {
                statusCode: 200
            });
        } catch (e) {
            return this.req.apiResponse.generateAndSendErrorReponse(e);
        }
    }

    async getAllBrackets() {
        const bracketService = new BracketService();
        try {
            const brackets = await bracketService.getAllBrackets();
            return this.req.apiResponse.generateAndSendWithStatus(brackets, {
                statusCode: 200
            });
        } catch (e) {
            return this.req.apiResponse.generateAndSendWithStatus(e.message, {
                statusCode: 400
            });
        }
    }
}
