import neo4j from "neo4j-driver";
import {queue} from "rxjs";
import {valueToNode} from "@babel/types";

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
    { disableLosslessIntegers: true }
);

export default async function getMarketplaceDistro(name: String, token: string | undefined, washtrades: boolean): Promise<any[]> {

    const session = driver.session();

    let query;

    if (washtrades) {
        if (typeof token == "undefined") {
            query = `MATCH ()-[r]->() where r.collection = "${name}" and r.flagged = true RETURN r.marketplace AS type, COUNT(r.marketplace) AS amount`
        } else {
            query = `MATCH ()-[r]->() where r.collection = "${name}" and r.token = "${token}" and r.flagged = true RETURN r.marketplace AS type, COUNT(r.marketplace) AS amount`
        }
    } else {
        if (typeof token == "undefined") {
            query = `MATCH ()-[r]->() where r.collection = "${name}" RETURN r.marketplace AS type, COUNT(r.marketplace) AS amount`
        } else {
            query = `MATCH ()-[r]->() where r.collection = "${name}" and r.token = "${token}" RETURN r.marketplace AS type, COUNT(r.marketplace) AS amount`
        }
    }

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

    return convert(map)
}
function convert(original: Map<string, number>): any[] {
    let multiArray = [];
    original.forEach((key, value) => {
        multiArray.push([value, key])
    })
    return multiArray;
}
