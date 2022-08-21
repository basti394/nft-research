import neo4j, {LocalDateTime} from "neo4j-driver";
import {timestamp} from "rxjs/operators";
import {recordExpression} from "@babel/types";

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);
const session = driver.session();

export default async function checkIfCollectionIsStored(name: string): Promise<boolean> {

    if (name == 'system') {
        throw 'invalid_name';
    }

    const query = 'show databases';

    let result;

    try {
        result = await session.run(query)
    } catch {
        throw 'db_error';
    }

    let timestamps = result.records.map((record) => record.timestamp)
    let tempHighestNumber = 0

    timestamps.forEach((record) => {
        if (tempHighestNumber < record) {
            tempHighestNumber = record
        }
    })

    if (result.records.some((record) => record._fields[0] == name.replaceAll('_', '.'))) {
        if (tempHighestNumber + (604800 * 2) < Date.now()) {
            const query = `use ${name.replace('-', '.')} MATCH (n) DETACH DELETE n`
            try {
                await session.run(query)
            } catch {
                throw 'db_error';
            }
            return false
        }
        return true
    }
}
