import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Player from "@/domain/models/Player";
import Match from "@/domain/models/Match";

@Entity("match_stats")
export default class MatchStats {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Player)
    @JoinColumn({
        name: "player_id"
    })
    player: Promise<Player>

    @Column()
    points: number;

    @ManyToOne(() => Match, match => match.matchStats)
    @JoinColumn({
        name: "match_id"
    })
    match: Promise<Match>;

    @Column()
    finished: boolean;
}
