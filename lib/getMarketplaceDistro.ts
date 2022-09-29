import neo4j from "neo4j-driver";

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
    { disableLosslessIntegers: true }
);

export default async function getMarketplaceDistro(name: String): Promise<Map<string, number>> {

    const session = driver.session();

    const query = `MATCH ()-[r]->() where r.collection = "${name}" RETURN r.marketplace AS type, COUNT(r.marketplace) AS amount`

    let data;

    try {
        data = await session.run(query)
    } catch (e) {
        throw e;
    }

    let map = new Map<string, number>()

    data.records.forEach(record => {
        const marketplace: string = record._fields[0]
        const amount: number = record._fields[1]
        map.set(marketplace, amount)
    })

    return map
}