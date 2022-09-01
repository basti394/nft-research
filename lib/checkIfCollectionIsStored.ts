import neo4j, {LocalDateTime} from "neo4j-driver";

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);
const session = driver.session();

export default async function checkIfCollectionIsStored(name: string): Promise<boolean> {

    if (name == 'system') {
        throw 'invalid_name';
    }

    const query = `match (n)-[r]->(m) where any(collection in r.collection where collection = "${name}") return n, r, m`;

    let result;

    try {
        result = await session.run(query)
        console.log('query run')
    } catch (e) {
        throw e;
    }

    return result.records.some((record) => record._fields.length != 0);
}
