import neo4j from "neo4j-driver";

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
    { disableLosslessIntegers: true }
);

export default async function getAllStoredCollectionNames(chain: string | undefined): Promise<string[]> {
    const session = driver.session();

    console.log(chain == undefined)

    const query = chain != undefined
        ? `MATCH ()-[r]-() WHERE (r.collection) AND r.chain = "${chain}" IS NOT NULL RETURN distinct r.collection`
        : `MATCH ()-[r]-() WHERE (r.collection) IS NOT NULL RETURN distinct r.collection`

    let data;

    try {
        data = await session.run(query)
    } catch (e) {
        throw e;
    }

    let list = []
    data.records.forEach(x => list.push(x._fields[0]))

    return list
}