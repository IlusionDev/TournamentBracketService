import { Connection, createConnection, getConnection } from 'typeorm'

export async function getConnectionOrCreate (): Promise<Connection> {
    return await createConnection({
        type: 'postgres',
        logging: true,
        schema: 'game',
        host: 'localhost',
        database: 'game',
        username: 'postgres',
        entities: [ 'src/domain/models/**/*.ts' ],
    })
}

export function getManager () {
    return getConnection().manager
}
