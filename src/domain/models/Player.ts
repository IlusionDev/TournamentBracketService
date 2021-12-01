import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";

@Entity("players")
export default class Player {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Exclude()
    @Column({ select: false })
    password: string;

    @Column()
    email: string;

    @Column()
    balance: number;

}
