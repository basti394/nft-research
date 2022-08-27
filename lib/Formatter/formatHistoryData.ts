import {element, node} from "prop-types";

export default function formatHistoryData(data, washtraders: Set<string>): { nodes: any[]; links: any[]; } {
    const nodes = []
    const links = []

    console.log(washtraders)

    data.forEach((element) => {

        let node1 = element[0]
        let node2 = element[2]

        if (!nodes.some((node) => {return node.id == node1.properties.address})) {
            if (washtraders.has(node1.properties.address)) {
                console.log('einer der mal group 3 ist')
                nodes.push({
                    id: node1.properties.address,
                    washtrader: node1.properties.washtrader,
                    group: 2
                })
            } else {
                nodes.push({
                    id: node1.properties.address,
                    washtrader: node1.properties.washtrader,
                    group: 1
                })
            }
        }

        if (!nodes.some((node) => {return node.id == node2.properties.address})) {
            if (washtraders.has(node2.properties.address)) {
                nodes.push({
                    id: node2.properties.address,
                    washtrader: node2.properties.washtrader,
                    group: 2
                })
            } else {
                nodes.push({
                    id: node2.properties.address,
                    washtrader: node2.properties.washtrader,
                    group: 1
                })
            }
        }

        links.push({
            source: node1.properties.address,
            target: node2.properties.address,
            flagged: element[1].properties.flagged,
            curvature: 0,
            name: `price: ${element[1].properties.price} SOL \n marketplace: ${element[1].properties.marketplace} \n token: ${element[1].properties.token}`
        })
    })

    return { nodes, links }
}
