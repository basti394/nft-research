import {element, node} from "prop-types";
import getCurrency from "../getCurrency";

export default function formatToGraphData(wholeData, chain: string): { nodes: any[]; links: any[]; } {

    const nodes = []
    const links = []

    wholeData?.forEach((data, index) => {

        if (!nodes.some(element => element.id == data.seller)) {
            nodes.push({
                id: data.seller,
                group: 3
            })
        }

        if (!nodes.some(element => element.id == data.buyer)) {
            nodes.push({
                id: data.buyer,
                group: 3
            })
        }

        let repetitions = links.filter((element) => element.source == data.seller && element.target == data.target).length

        if (repetitions % 2 == 0) {
            links.push({
                source: data.seller,
                target: data.buyer,
                name: `price: ${data.price} ${getCurrency(chain)}, \n marketplace: ${data.source}, \n token: ${data.tokenMint}`,
                token: data.tokenMint,
                curvature: 0.3 * repetitions,
            })
        } else {
            links.push({
                source: data.seller,
                target: data.buyer,
                name: `price: ${data.price} ${getCurrency(chain)}, \n marketplace: ${data.source}, \n token: ${data.tokenMint}`,
                token: data.tokenMint,
                curvature: -0.3 * repetitions,
            })
        }
    })

    console.log('data', {nodes, links})

    return { nodes, links }
}
