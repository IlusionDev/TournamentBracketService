import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Round from "@/domain/models/Round";
import Player from "@/domain/models/Player";

@Entity("brackets",)
export default class Bracket {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        "name": "ticket_slots",
    })
    ticketSlots: number;

    @Column()
    price: number;

    @Column()
    reward: number;

    @Column()
    finished: boolean;

    @OneToMany(() => Round, round => round.bracket)
    rounds: Promise<Round[]>;

    @Column({
        "name": "match_size"
    })
    matchSize: number;

    @OneToOne(() => Player)
    @JoinColumn({
        "name": "winner_id",
    })
    winner: Player;

    @ManyToMany(() => Player)
    @JoinTable({
        "name": "bracket_players",
        "joinColumn": {
            "name": "bracket_id",
            "referencedColumnName": "id",
        },
        "inverseJoinColumn": {
            "name": "player_id",
            "referencedColumnName": "id",
        },
    })
    players: Promise<Player[]>;

    @Column()
    started: boolean;
}
