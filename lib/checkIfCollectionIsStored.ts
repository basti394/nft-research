import neo4j from "neo4j-driver";

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);
const session = driver.session();

export default async function checkIfCollectionIsStored(name: string): Promise<boolean> {

    if (name == 'system') {
        return false;
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
