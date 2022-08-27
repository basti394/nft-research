import {element} from "prop-types";

export default function getSCCs(data): {nodes: any[], links: any[]} {

    let nodes = []
    let links = []

    data.nodes.forEach((element) => {
        if (element.washtrader) {
            nodes.push(element)
        }
    })

    data.links.forEach((element) => {
        if (element.flagged) {
            links.push(element)
        }
    })

    console.log('sccs', { nodes, links })

    return { nodes, links }
}