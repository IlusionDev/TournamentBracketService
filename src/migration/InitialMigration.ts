import { MigrationInterface, QueryRunner } from "typeorm";

export class PostRefactoringTIMESTAMP implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`create table if not exists game.players
        (
            id uuid default uuid_generate_v4
                                 (
                                 ) not null
            constraint players_pk
            primary key,
            password varchar not null,
            email varchar not null,
            balance integer default 0
            );
        `);
        await queryRunner.query(`alter table game.players owner to postgres;`);
        await queryRunner.query(`create unique index if not exists players_email_uindex on game.players (email);`);
        await queryRunner.query(`create table if not exists game.brackets
        (
            id uuid default uuid_generate_v4
                                 (
                                 ) not null
            constraint bracket_pk
            primary key,
            ticket_slots integer default 2,
            price integer not null,
            reward integer not null,
            finished boolean default false,
            match_size integer default 2,
            winner_id uuid
            constraint bracket___fk_winner_player_id
            references game.players,
            started boolean default false
            );`);
        await queryRunner.query(`alter table game.brackets owner to postgres;`);
        await queryRunner.query(`create table if not exists game.rounds
        (
            id uuid default uuid_generate_v4
                                 (
                                 ) not null
            constraint rounds_pk
            primary key,
            finished boolean default false,
            bracket_id uuid not null
            constraint rounds___fk_bracket_id
            references game.brackets
            on update cascade
            on delete cascade
            );
        `);
        await queryRunner.query(`alter table game.rounds owner to postgres;`);
        await queryRunner.query(`create table if not exists game.matches
        (
            id uuid default uuid_generate_v4
                                 (
                                 ) not null
            constraint matches_pk
            primary key,
            winner uuid
            constraint matches___fk_winner_player_id
            references game.players,
            round_id uuid
            constraint matches___fk_round_id
            references game.rounds
            on update cascade
            on delete cascade
            );
        `);
        await queryRunner.query(`alter table game.matches owner to postgres;`);
        await queryRunner.query(`create table if not exists game.match_stats
            (
                id uuid default uuid_generate_v4
            (
            ) not null
                constraint match_stats_pk
                primary key,
                player_id uuid not null
                constraint match_stats___fk_player_id
                references game.players
                on update cascade
                on delete cascade,
                points integer default 0,
                match_id uuid not null
                constraint match_stats___fk_match_id
                references game.matches
                on update cascade
                on delete cascade,
                finished boolean default false
                );`);
        await queryRunner.query(`alter table game.match_stats owner to postgres;`);
        await queryRunner.query(`create table if not exists game.match_players
                                 (
                                     match_id
                                     uuid
                                     not
                                     null
                                     constraint
                                     match_players___fk_match_id
                                     references
                                     game
                                     .
                                     matches
                                     on
                                     update
                                     cascade
                                     on
                                     delete
                                     cascade,
                                     player_id
                                     uuid
                                     not
                                     null
                                     constraint
                                     match_players___fk_player_id
                                     references
                                     game
                                     .
                                     players
                                     on
                                     update
                                     cascade
                                     on
                                     delete
                                     cascade
                                 );`);
        await queryRunner.query(`alter table game.match_players owner to postgres;`);
        await queryRunner.query(`create table if not exists game.bracket_players
                                 (
                                     bracket_id
                                     uuid
                                     not
                                     null
                                     constraint
                                     bracket_players___fk_bracket_id
                                     references
                                     game
                                     .
                                     brackets
                                     on
                                     update
                                     cascade
                                     on
                                     delete
                                     cascade,
                                     player_id
                                     uuid
                                     not
                                     null
                                     constraint
                                     bracket_players___fk_player_id
                                     references
                                     game
                                     .
                                     players
                                     on
                                     update
                                     cascade
                                     on
                                     delete
                                     cascade
                                 );`);
        await queryRunner.query(`alter table game.bracket_players owner to postgres;`);

    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`drop table game.match_stats;`);
        await queryRunner.query(`drop table game.matches;`);
        await queryRunner.query(`drop table game.rounds;`);
        await queryRunner.query(`drop table game.brackets;`);
        await queryRunner.query(`drop table game.players;`);
        await queryRunner.query(`drop table game.bracket_players;`);
        await queryRunner.query(`drop table game.match_player;`);
    }
}
