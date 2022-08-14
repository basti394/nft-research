import {element, node} from "prop-types";

export default function foramtMagicEdenToGraphData(data): { nodes: any[]; links: any[]; } {
    const nodes = []
    const links = []

    data?.forEach( (data) => {

        if (!nodes.includes({id: data.seller, group: 1})) {
            nodes.push({
                id: data.seller,
                group: 1
            })
        }

        if (!nodes.includes({id: data.buyer, group: 1})) {
            nodes.push({
                id: data.buyer,
                group: 1
            })
        }

        let repetitions = links.filter((element) => element.source == data.seller && element.target == data.target).length

        if (repetitions % 2 == 0) {
            links.push({
                source: data.seller,
                target: data.buyer,
                name: `price: ${data.price} SOL, \n marketplace: ${data.source}, \n token: ${data.tokenMint}`,
                curvature: 0.3 * repetitions,
            })
        } else {
            links.push({
                source: data.seller,
                target: data.buyer,
                name: `price: ${data.price} SOL, \n marketplace: ${data.source}, \n token: ${data.tokenMint}`,
                curvature: -0.3 * repetitions,
            })
        }
    })

    return { nodes, links }
}
