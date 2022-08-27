import {ApolloClient, InMemoryCache} from "@apollo/client";
import {gql} from "apollo-server-micro";
import formatHistoryData from "../../../lib/Formatter/formatHistoryData";
import checkIfCollectionIsStored from "../../../lib/checkIfCollectionIsStored";
import storeNewCollection from "../../../lib/storeNewCollection";
import foramtMagicEdenToGraphData from "../../../lib/Formatter/formatMagicEdenToGraphData";
import formatMagicEdenToGraphData from "../../../lib/Formatter/formatMagicEdenToGraphData";
import Graph from "../../../lib/Graph";
import {element} from "prop-types";
import markAddressAsWashTrader from "../../../lib/markAddressAsWashtrader";
import getData from "../../../lib/getData";

export default async function handler(req, res) {
    const name = req.query.name;

    const client = new ApolloClient({
        headers: {
            database: name
        },
        uri: 'http://localhost:3000/api/graphql',
        cache: new InMemoryCache(),
    });

    let isCollectionStored;

    try {
        isCollectionStored = await checkIfCollectionIsStored(name);
    } catch (e) {
        res.status(500).send(e);
        return;
    }

    if (!isCollectionStored) {
        console.log('Anfrage an MagicEden')

        let data: any[][] = await requestFromME(name)

        let newArr = [];

        for(let i = 0; i < data.length; i++)
        {
            newArr = newArr.concat(data[i]);
        }

        data = newArr.filter((element) => element.type == "buyNow")

        await storeNewCollection(name.replaceAll('_', '.'), JSON.stringify(data));

        const formattedData = formatMagicEdenToGraphData(data)

        const allNodes = formattedData.nodes
        const nodesParseMap = new Map()

        allNodes.forEach((element, index) => nodesParseMap.set(element.id, index))

        console.log('NodesParseMap: ', nodesParseMap)

        const graph: Graph = new Graph(allNodes.length)

        const parsedLinks: {source: number, target: number}[] = []

        formattedData.links.forEach(element => {
            parsedLinks.push({source: nodesParseMap.get(element.source), target: nodesParseMap.get(element.target)})
        })

        console.log('parsedLinks: ', parsedLinks)

        parsedLinks.forEach(element => {
            graph.addEdge(element.source, element.target)
        })

        const sccs = graph.SCC()

        console.log('sccs: ', sccs)

        let parsedSCCs = []
        sccs.forEach((element) => {
            console.log('element: ', element)
            let x = []
            element.forEach((value) => {
                x.push(getByValue(nodesParseMap, value))
            })
            parsedSCCs.push(x)
        })

        console.log('sccs in normal values: ', parsedSCCs)

        for (const scc of parsedSCCs) {
            for (const element1 of scc) {
                await markAddressAsWashTrader(element1, name);
            }
        }
    }

    const data = await getData(name)

    let washtraders = []

    data.forEach((element) => {
        if (element[0].properties.washtrader == true) {
            washtraders.push(element[0].properties.address)
        }
        if (element[2].properties.washtrader == true) {
            washtraders.push(element[2].properties.address)
        }
    })

    const washtraderSet = new Set<string>(washtraders)

    const formattedData = formatHistoryData(data, washtraderSet)

    console.log('Data formatted')

    res.status(200).send(formattedData);
}

function getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
        if (value === searchValue)
            return key;
    }
}

async function requestFromME(name: string): Promise<any> {

    let list = []

    for (let i = 0; i < 1000; i++) {
        const response = await fetch(`https://api-mainnet.magiceden.dev/v2/collections/${name}/activities?offset=${i * 100}&limit=100`)
        const data = await response.json();
        list.push(data)
    }

    return list
}
