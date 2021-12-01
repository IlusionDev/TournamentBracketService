import BracketService from "@/domain/services/BracketService";
import { ErrorPlayerTicketAlreadyTaken } from "@/global/errors/ErrorPlayerTicketAlreadyTaken";
import { ErrorPlayerCantAffordBracket } from "@/global/errors/ErrorPlayerNotHaveEnoughtMoney";
import { ErrorNotFound } from "@/global/errors/ErrorNotFound";
import { ErrorBracketFull } from "@/global/errors/ErrorBracketFull";
import { ErrorNotSaved } from "@/global/errors/ErrorNotSaved";
import { BuyTournamentTicketDto } from "@/domain/definitions/dto/BuyTournamentTicketDto";
import BracketTournamentRepository from "@/domain/repositories/BracketTournamentRepository";
import PlayerRepository from "@/domain/repositories/PlayerRepository";
import Player from "@/domain/models/Player";
import Bracket from "@/domain/models/Bracket";

export default class BracketTicketService {

    _hasAlreadyTicket(playerId: string, tournamentId: string): Promise<Bracket> {
        const bracketTicketRepository = new BracketTournamentRepository();
        return bracketTicketRepository.getBracketPlayerById(playerId, tournamentId);
    }

    _canAffordTicket(bracketTicket, player) {
        return player.balance >= bracketTicket.price;
    }

    async _canBuyTicket(bracketTicket, player) {
        const hasAlreadyTicket = await this._hasAlreadyTicket(player.id, bracketTicket.id);
        const canAffordTicket = this._canAffordTicket(bracketTicket, player);

        return canAffordTicket && typeof hasAlreadyTicket === 'undefined';
    }

    async _checkBuyConditions(bracket, player) {
        if (!bracket) {
            throw new ErrorNotFound('Bracket tournament');
        }

        if (!player) {
            throw new ErrorNotFound('Player');
        }

        if (bracket.finished || bracket.started) {
            throw new Error('Bracket tournament is finished or started');
        }

        const bracketService = new BracketService();
        const canAffordTicket = this._canAffordTicket(bracket, player);
        const canBuyTicket = await this._canBuyTicket(bracket, player);
        const isFull = await bracketService.isBracketFull(bracket);

        if (!canAffordTicket) {
            throw new ErrorPlayerCantAffordBracket();
        }

        if (!canBuyTicket) {
            throw new ErrorPlayerTicketAlreadyTaken();
        }

        if (isFull) {
            throw new ErrorBracketFull();
        }
    }

    async buyBracketTournamentTicket(buyTournamentTicketDto: BuyTournamentTicketDto): Promise<boolean> {
        const bracketTournamentRepository = BracketTournamentRepository.getRepository();
        const playerRepository = PlayerRepository.getRepository();
        const bracketTournament = await bracketTournamentRepository.findOne(buyTournamentTicketDto.bracketId);
        const player = await playerRepository.findOne(buyTournamentTicketDto.playerId);

        await this._checkBuyConditions(bracketTournament, player);
        await playerRepository.update(player, { balance: player.balance - bracketTournament.price });
        const players: Player[] = await bracketTournament.players

        players.push(player)

        // @ts-ignore
        bracketTournament.players = players

        const bracket = await bracketTournamentRepository.save(bracketTournament);

        if (!bracket) {
            throw new ErrorNotSaved('Bracket');
        }

        return true;
    }
}
