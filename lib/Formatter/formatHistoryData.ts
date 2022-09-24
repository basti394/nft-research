import {element, node} from "prop-types";

export default function formatHistoryData(data, washtraders: Set<string>): { nodes: any[]; links: any[]; } {
    const nodes = []
    const links = []


    data.forEach((element) => {

        let node1 = element[0]
        let node2 = element[2]

        if (!nodes.some((node) => node.id == node1.properties.address)) {
            if (washtraders.has(node1.properties.address)) {
                nodes.push({
                    id: node1.properties.address,
                    washtrader: node1.properties.washtrader,
                    group: 1
                })
            } else {
                nodes.push({
                    id: node1.properties.address,
                    washtrader: node1.properties.washtrader,
                    group: 2
                })
            }
        }

        if (!nodes.some((node) => node.id == node2.properties.address)) {
            if (washtraders.has(node2.properties.address)) {
                nodes.push({
                    id: node2.properties.address,
                    washtrader: node2.properties.washtrader,
                    group: 1
                })
            } else {
                nodes.push({
                    id: node2.properties.address,
                    washtrader: node2.properties.washtrader,
                    group: 2
                })
            }
        }

        if (element[1].properties.flagged) {
            links.push({
                source: node1.properties.address,
                target: node2.properties.address,
                flagged: element[1].properties.flagged,
                curvature: 0,
                name: `price: ${element[1].properties.price} SOL \n marketplace: ${element[1].properties.marketplace} \n token: ${element[1].properties.token}`
            })
        } else {
            links.push({
                source: node1.properties.address,
                target: node2.properties.address,
                flagged: element[1].properties.flagged,
                curvature: 0,
                name: `price: ${element[1].properties.price} SOL \n marketplace: ${element[1].properties.marketplace} \n token: ${element[1].properties.token}`
            })
        }

    })

    return { nodes, links }
}
