import neo4j from "neo4j-driver";

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
    { disableLosslessIntegers: true }
);

export default async function getMarketplaceDistro(name: String, token: string | undefined, washtrades: boolean): Promise<any[][]> {

    const session = driver.session();

    let query;

    if (typeof token == "undefined") {
        query = `MATCH ()-[r]->() where r.collection = "${name}" RETURN r.marketplace AS type, COUNT(r.marketplace) AS amount, size(collect(case when r.flagged = true then r end))`
    } else {
        query = `MATCH ()-[r]->() where r.collection = "${name}" and r.token = "${token}" RETURN r.marketplace AS type, COUNT(r.marketplace) AS amount, size(collect(case when r.flagged = true then r end))`
    }

    console.log(query)

    let data;

    try {
        data = await session.run(query)
    } catch (e) {
        throw e;
    }

    let marketDistroList: any[][] = []

    data.records.forEach(record => {
        const marketplace: string = record._fields[0]
        const trades: number = record._fields[1]
        const washTrades: number = washtrades ? record._fields[2] : 0
        marketDistroList.push([marketplace, trades, washTrades])
    })

    return marketDistroList
}
