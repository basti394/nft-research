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
        data = newArr

        await storeNewCollection(name.replaceAll('_', '.'), JSON.stringify(data));

        console.log("HAHAHAHAHA")

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

        parsedSCCs.forEach((address) => markAddressAsWashTrader(address, name))
    }

    const data = await client.query({
        query: gql`
          {
            users {
              address
              soldTo {
                address
               }
              soldToConnection {
                edges{
                  price
                  marketplace
                  token
                }
              }
            }
          }`
    });

    const formattedData = formatHistoryData(data.data)

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

    for (let i = 0; i < 10; i++) {
        const response = await fetch(`https://api-mainnet.magiceden.dev/v2/collections/${name}/activities?offset=${i*100}&limit=100`)
        const data = await response.json();
        list.push(data)
    }

    return list
}
