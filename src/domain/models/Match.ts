import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import Round from "@/domain/models/Round";
import MatchStats from "@/domain/models/MatchStats";
import Player from "@/domain/models/Player";

@Entity("matches")
export default class Match {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(() => Player)
    @JoinColumn({ name: "winner" })
    winner: Promise<Player>;

    @ManyToOne(() => Round, round => round.matches)
    @JoinColumn({ name: "round_id" })
    round: Promise<Round>;

    @ManyToMany(() => Player)
    @JoinTable({
        name: "match_players",
        joinColumn: {
            name: "match_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "player_id",
            referencedColumnName: "id"
        }
    })
    players: Promise<Player[]>;

    @OneToMany(() => MatchStats, matchStats => matchStats.match)
    matchStats: Promise<MatchStats[]>;

}
