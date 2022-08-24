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

    return result.records.some((record) => record._fields[0] == name.replaceAll('_', '.'));
}
