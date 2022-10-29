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

        console.log(JSON.stringify(dataMe))

        await storeNewCollection(name, JSON.stringify(dataMe));

        const formattedDataME = formatMagicEdenToGraphData(dataMe)

        const allNodes = formattedDataME.nodes
        const nodesParseMap = new Map()

        allNodes.forEach((element, index) => nodesParseMap.set(element.id, index))

        console.log('NodesParseMap: ', nodesParseMap)

        let graph: Graph = new Graph(allNodes.length)

        let parsedLinks: { source: number, target: number }[] = []

        formattedDataME.links.forEach(element => {
            parsedLinks.push({source: nodesParseMap.get(element.source), target: nodesParseMap.get(element.target)})
        })

        console.log('parsedLinks: ', parsedLinks)

        parsedLinks.forEach(element => {
            graph.addEdge(element.source, element.target)
        })

        let finalSCCs: number[][] = []
        let found: boolean = true

        while (found) {
            console.log('searching sccs')
            let sccs = graph.SCC()

            console.log(sccs)

            found = sccs.length != 0;

            console.log(found)

            sccs.forEach((scc) => {
                console.log('scc: ', scc)
                scc.forEach((element) => {
                    console.log('element: ', element)
                    scc.forEach((element1) => {
                        console.log('element1: ', element1)
                        let links = parsedLinks.filter((element2) => element2.source == element && element2.target == element1)
                        parsedLinks = parsedLinks.filter((element2) => element2.source != element || element2.target != element1)

                        links.shift()

                        if (links.length > 0) {
                            links.forEach((link) => parsedLinks.push(link))
                        }
                    })
                })
            })

            console.log(parsedLinks)

            graph = new Graph(parsedLinks.length)

            parsedLinks.forEach(element => {
                graph.addEdge(element.source, element.target)
            })

            sccs.forEach((element) => {
                if (element.length != 0) {
                    finalSCCs.push(element)
                }
            })
        }

        let parsedSCCs = []
        finalSCCs.forEach((element) => {
            console.log('element: ', element)
            let x = []
            element.forEach((value) => {
                x.push(getByValue(nodesParseMap, value))
            })
            parsedSCCs.push(x)
        })

        console.log('sccs in normal values: ', parsedSCCs)

        const parsedLinksAsSet: number[][] = parsedSCCs.slice()

        parsedLinksAsSet.forEach((element, index) => {
            let test = parsedLinksAsSet.filter((test) => areEqual(test, element))
            if (test.length > 1) {
                parsedLinksAsSet.splice(index, 1)
            }
        })
        let wtSCCs = []

        parsedLinksAsSet.forEach((element) => {
            let repetitions = 0
            parsedSCCs.forEach((element1) => {
                if (areEqual(element1, element)) {
                    repetitions = repetitions + 1;
                }
            })
            if (repetitions >= threshold) {
                wtSCCs.push(element)
            }
        })

        console.log('wtSCC. ', wtSCCs)

        for (const scc of wtSCCs) {
            for (const element1 of scc) {
                await markAddressAsWashTrader(element1, name);
            }
        }

        for (const scc of wtSCCs) {
            for (const element2 of scc) {
                console.log(element2)
                console.log(" ")
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

    res.status(200).send({
        data: formattedData,
        amountTrades: amountTrades,
        amountTradedNFTs: amountTradedNFTs,
        amountTrader: amountTrader,
        totalTradingVolume: totalTradingVolume,
        marketplaceDistro: marketplaceDistro
    });
}

function getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
        if (value === searchValue)
            return key;
    }
}

async function requestFromME(name: string): Promise<any> {

    let list = []

    let lastData = [""];

    for (let i = 0; i < 1000; i++) {
        if (lastData.length == 0) {
            break;
        }
        console.log("sending request ", i)
        const response = await fetch(`https://api-mainnet.magiceden.dev/v2/collections/${name}/activities?offset=${i * 100}&limit=100`)
        console.log("received response: ")
        console.log(response.status)
        if (response.status == 429) {
            await new Promise(f => setTimeout(f, 60000));
            i--;
            continue;
        }
        const data = await response.json();
        lastData = data;
        console.log(data.length)
        list.push(data)
    }

    return list
}

function areEqual(array1, array2) {
    if (array1.length === array2.length) {
        return array1.every((element, index) => {
            return element === array2[index];
        });
    }

    return false;
}
