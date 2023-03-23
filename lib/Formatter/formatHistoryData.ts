import {element, node} from "prop-types";
import getCurrency from "../getCurrency";

export default function formatHistoryData(data, washtraders: Set<string>, chain: string): { nodes: any[]; links: any[]; } {
    let nodes = []
    let links = []

    let linkOccurrenceList: {source: any, target: any, occurrence: number}[] = []

    data.forEach((element) => {

        let node1 = element[0]
        let node2 = element[2]

        const linkPredicate = obj => obj.source == node1.properties.address && obj.target == node2.properties.address

        if (linkOccurrenceList.some(linkPredicate)) {
            linkOccurrenceList.find(linkPredicate).occurrence += 1
        } else {
            linkOccurrenceList.push({
                source: node1.properties.address,
                target: node2.properties.address,
                occurrence: 1
            })
        }

        //format nodes
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

        if (links.some(linkPredicate)) {

            const oldName = links.find(linkPredicate).name.split(" ")
            oldName.shift()
            links.find(linkPredicate).name = `${linkOccurrenceList.find(linkPredicate).occurrence}<br><br> ` + oldName + `price: ${element[1].properties.price} ${getCurrency(chain)} <br> marketplace: ${element[1].properties.marketplace} <br> token: ${element[1].properties.token}<br><br>`

        } else {
            if (element[1].properties.flagged) {
                links.push({
                    source: node1.properties.address,
                    target: node2.properties.address,
                    flagged: element[1].properties.flagged,
                    name: `${linkOccurrenceList.find(linkPredicate).occurrence}<br><br> ` + `price: ${element[1].properties.price} ${getCurrency(chain)} <br> marketplace: ${element[1].properties.marketplace} <br> token: ${element[1].properties.token}<br><br>`,
                    group: 1
                })
            } else if (!element[1].properties.flagged) {
                links.push({
                    source: node1.properties.address,
                    target: node2.properties.address,
                    flagged: element[1].properties.flagged,
                    name: `${linkOccurrenceList.find(linkPredicate).occurrence}<br><br> ` + `price: ${element[1].properties.price} ${getCurrency(chain)} <br> marketplace: ${element[1].properties.marketplace} <br> token: ${element[1].properties.token}<br><br>`,
                    group: 2
                })
            } else if (element[1].properties.priceAssumed) {
                links.push({
                    source: node1.properties.address,
                    target: node2.properties.address,
                    flagged: element[1].properties.flagged,
                    name: `${linkOccurrenceList.find(linkPredicate).occurrence}<br><br> ` + `price: ${element[1].properties.price} ${getCurrency(chain)} <br> marketplace: ${element[1].properties.marketplace} <br> token: ${element[1].properties.token}<br><br>`,
                    group: 3
                })
            }
        }
        //format links


    })

    return { nodes, links }
}