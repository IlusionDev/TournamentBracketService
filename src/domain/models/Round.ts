import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Bracket from "@/domain/models/Bracket";
import Match from "@/domain/models/Match";

@Entity("rounds")
export default class Round {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    finished: boolean;

    @ManyToOne(() => Bracket,
        BracketTournament => BracketTournament.rounds)
    @JoinColumn({ name: "bracket_id" })
    bracket: Promise<Bracket>;

    @OneToMany(() => Match, Match => Match.round)
    matches: Promise<Match[]>;
}

