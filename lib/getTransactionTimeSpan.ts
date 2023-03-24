import neo4j from "neo4j-driver";

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);
const session = driver.session();

export default async function getTransactionTimeSpan(collection: string, token: string | undefined): Promise<[number, number]> {

    let queryEarliest
    let queryLatest

    if (typeof token == "undefined") {
        queryEarliest = `MATCH ()-[r]-() WHERE r.collection = "${collection}" RETURN r.timeStamp AS smallest_property_value ORDER BY smallest_property_value ASC LIMIT 1`
        queryLatest = `MATCH ()-[r]-() WHERE r.collection = "${collection}" RETURN r.timeStamp AS smallest_property_value ORDER BY smallest_property_value DESC LIMIT 1`
    } else {
        queryEarliest = `MATCH ()-[r]-() WHERE r.collection = "${collection}" and r.token = "${token}" RETURN r.timeStamp AS smallest_property_value ORDER BY smallest_property_value ASC LIMIT 1`
        queryLatest = `MATCH ()-[r]-() WHERE r.collection = "${collection}" and r.token = "${token}" RETURN r.timeStamp AS smallest_property_value ORDER BY smallest_property_value DESC LIMIT 1`
    }


    let resultEarliest
    let resultLatest

    try {
        resultLatest = await session.run(queryLatest);
        resultEarliest = await session.run(queryEarliest);
        console.log('Data successfully added')
    } catch (e) {
        throw e;
    }

    const earliestTimeStamp = resultEarliest.records[0]
    const latestTimeStamp = resultLatest.records[0]

    if (earliestTimeStamp == null || latestTimeStamp == null) return [0, 0]

    return [earliestTimeStamp._fields[0].low, latestTimeStamp._fields[0].low]
}