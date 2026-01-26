import { Client } from 'pg';
import { selectScenarios, SelectScenarioKey } from './dbApplications';

 type GetDbValueOptions = {
    scenario: SelectScenarioKey;
    params: any[];
 };

export async function getDbValue({
    scenario,
    params,
}: GetDbValueOptions): Promise<string> {
    
    const { table, whereField, selectField } = selectScenarios[scenario];
    
    const query = 
    `SELECT ${selectField}
    FROM ${table}
    WHERE ${whereField} = $1`;

    const client = new Client({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
    
    try {
        await client.connect();
        const result = await client.query(query, params);
        
        if (!result.rows.length) {
            throw new Error('DB query returned no rows');
        }
        
        return String(result.rows[0][selectField]);
    } catch (e: any) {
        throw new Error(`getDbValue failed (${scenario}): ${e.message}`);
    } finally {
        await client.end();
    }
}