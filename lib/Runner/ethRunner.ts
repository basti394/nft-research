import getAllStoredCollectionNames from "../getAllStoredCollectionNames";
import getLatestTimestamp from "../getLatestTimestamp";
import getEthCollection from "../Repository/getEthCollection";
import formatToGraphData from "../Formatter/formatToGraphData";
import getWTSCCs from "../getWTSCCs";
import markAddressAsWashTrader from "../markAddressAsWashtrader";
import markTransactionAsWashtrade from "../markTransactionAsWashtrade";

const threshold = 5

export default async function ethRunner() {

    const chain = "eth"

    const collections: string[] = await getAllStoredCollectionNames(chain)

    for (const collection of collections) {
        const from = await getLatestTimestamp(chain, collection)
        const to = new Date()

        const newData = getEthCollection(collection, from, to)

        const formattedDataME = formatToGraphData(newData, chain)

        const allNodes = formattedDataME.nodes
        const allLinks = formattedDataME.links

        const wtSCCs = getWTSCCs(allNodes, allLinks, threshold)

        console.log('wtSCC. ', wtSCCs)

        for (const scc of wtSCCs) {
            for (const element1 of scc) {
                await markAddressAsWashTrader(element1, collection);
            }
        }

        for (const scc of wtSCCs) {
            for (const element2 of scc) {
                console.log(element2)
                for (const element1 of scc.filter((element) => element != element2)) {
                    console.log("|______", element1)
                    await markTransactionAsWashtrade(element2, element1, collection)
                }
            }
        }
    }
}
