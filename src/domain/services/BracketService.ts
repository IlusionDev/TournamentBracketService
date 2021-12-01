import Bracket from "@/domain/models/Bracket";
import { BracketTournamentDto } from "@/domain/definitions/dto/BracketTournamentDto";
import { BracketTournamentUpdateDto } from "@/domain/definitions/dto/BracketTournamentUpdateDto";
import BracketTournamentRepository from "@/domain/repositories/BracketTournamentRepository";
import { ErrorNotFound } from "@/global/errors/ErrorNotFound";
import { ErrorNotUpdated } from "@/global/errors/ErrorNotUpdated";
import { ErrorNotSaved } from "@/global/errors/ErrorNotSaved";


export default class BracketService {

    async createBracket(bracketTournament: BracketTournamentDto): Promise<Bracket> {
        const bracketTournamentRepository = BracketTournamentRepository.getRepository();
        const newBracketTournament = bracketTournamentRepository.create({
            price: bracketTournament.price,
            reward: bracketTournament.reward,
            finished: false,
            ticketSlots: bracketTournament.ticketSlots
        })

        const savedBracketTournament = await bracketTournamentRepository.save(newBracketTournament);

        if (!savedBracketTournament) {
            throw new ErrorNotSaved("Bracket");
        }

        return savedBracketTournament;
    }

    async updateBracket(bracketTournamentUpdateDto: BracketTournamentUpdateDto): Promise<any> {
        const bracketTournamentRepository = BracketTournamentRepository.getRepository();
        let bracketTournament: Bracket = await bracketTournamentRepository.findOne({
            where: {
                id: bracketTournamentUpdateDto.id
            }
        });

        if (!bracketTournament) {
            throw new ErrorNotFound("Bracket");
        }

        const updatedBracketTournament = await bracketTournamentRepository.update(bracketTournament.id, bracketTournamentUpdateDto);

        if (!updatedBracketTournament) {
            throw new ErrorNotUpdated("Bracket");
        }

        return updatedBracketTournament;
    }

    async isBracketFull(bracketTournament: Bracket): Promise<boolean> {
        const tickets = await bracketTournament.players
        return bracketTournament.ticketSlots === tickets.length;
    }

    async getAllBrackets(): Promise<Bracket[]> {
        const bracketTournamentRepository = BracketTournamentRepository.getRepository();
        return await bracketTournamentRepository.find({
            where: {
                finished: false
            }
        });
    }
}
