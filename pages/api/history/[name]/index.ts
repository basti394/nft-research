import checkIfCollectionIsStored from "../../../../lib/checkIfCollectionIsStored";
import storeNewCollection from "../../../../lib/storeNewCollection";
import formatMagicEdenToGraphData from "../../../../lib/Formatter/formatMagicEdenToGraphData";
import Graph from "../../../../lib/Graph"
import markAddressAsWashTrader from "../../../../lib/markAddressAsWashtrader";
import markTransactionAsWashtrade from "../../../../lib/markTransactionAsWashtrade";
import getData from "../../../../lib/getData";
import formatHistoryData from "../../../../lib/Formatter/formatHistoryData";
import getAmountTrades from "../../../../lib/getAmountTrades";
import getAmountTradedNFTs from "../../../../lib/getAmountTradedNFTs";
import getTotalVolume from "../../../../lib/getTotalVolume";
import getWashTraders from "../../../../lib/getWashtraders";
import {delay} from "rxjs/operators";
import getMarketplaceDistro from "../../../../lib/getMarketplaceDistro";
import {all} from "@neo4j/graphql/dist/translate/cypher-builder/expressions/functions/PredicateFunctions";
import getWTSCCs from "../../../../lib/getWTSCCs";

const threshold = 5

export default async function handler(req, res) {
    const name = req.query.name;

    let isCollectionStored;

    try {
        isCollectionStored = await checkIfCollectionIsStored(name);
    } catch (e) {
        res.status(500).send(e);
        return;
    }

    let dataMe: any[][]

    if (!isCollectionStored) {
        console.log('Anfrage an MagicEden')

        dataMe = await requestFromME(name)

        console.log("Received Data from Magic Eden")

        let newArr = [];

        for (let i = 0; i < dataMe.length; i++) {
            newArr = newArr.concat(dataMe[i]);
        }

        console.log("filtering list")

        dataMe = newArr.filter((element) => element.type == "buyNow")

        await storeNewCollection(name, JSON.stringify(dataMe));

        const formattedDataME = formatMagicEdenToGraphData(dataMe)

        const allNodes = formattedDataME.nodes
        const allLinks = formattedDataME.links

        const wtSCCs = getWTSCCs(allNodes, allLinks, threshold)

        console.log('wtSCC. ', wtSCCs)

        for (const scc of wtSCCs) {
            for (const element1 of scc) {
                await markAddressAsWashTrader(element1, name);
            }
        }

        for (const scc of wtSCCs) {
            for (const element2 of scc) {
                console.log(element2)
                for (const element1 of scc.filter((element) => element != element2)) {
                    console.log("|______", element1)
                    await markTransactionAsWashtrade(element2, element1, name)
                }
            }
        }
    }

    const data = await getData(name)

    const washtraderSet = await getWashTraders(name)

    const formattedData = formatHistoryData(data, washtraderSet)

    const amountTrades = await getAmountTrades(name, null)

    const amountTradedNFTs = await getAmountTradedNFTs(name, null)

    const amountTrader = formattedData.nodes.length

    const totalTradingVolume = await getTotalVolume(name, undefined)

    const marketplaceDistro = await getMarketplaceDistro(name, undefined, false)

    console.log({
        data: formattedData,
        amountTrades: amountTrades,
        amountTradedNFTs: amountTradedNFTs,
        amountTrader: amountTrader,
        totalTradingVolume: totalTradingVolume,
        marketplaceDistro: marketplaceDistro
    })

    res.status(200).send({
        data: formattedData,
        amountTrades: amountTrades,
        amountTradedNFTs: amountTradedNFTs,
        amountTrader: amountTrader,
        totalTradingVolume: totalTradingVolume,
        marketplaceDistro: marketplaceDistro
    });
}

async function requestFromME(name: string): Promise<any> {

    let list = []

    let lastData = [""];

    for (let i = 0; i < 3000; i++) {
        if (lastData.length == 0) {
            break;
        }
        console.log("sending request ", i)
        console.log("amount to receive ", i * 100)
        const response = await fetch(`https://api-mainnet.magiceden.dev/v2/collections/${name}/activities?offset=${i * 100}&limit=100`)
        console.log("received response: ", response.status)
        if (response.status == 429) {
            await new Promise(f => setTimeout(f, 60000));
            i--;
            continue;
        }
        if (response.status == 400) {
            break;
        }
        const data = await response.json();
        if (response.status != 200) {
            console.log("data: ", data)
        }
        lastData = data;
        console.log('data length ',data.length)
        console.log("-----------------------------------------")
        list.push(data)
    }

    return list
}
