
export default function formatHistoryData(data): { nodes: any[]; links: any[]; } {
    const nodes = []
    const links = []

    if (!data?.users) {
        return { nodes, links }
    }

    data?.users.forEach( (user) => {

        if (user.address == '8GSiZbxkd6nR2sNRftCNuAaPyX9Aoa9ER8RsiZDNzGuM') {
            nodes.push({
                id: user.address,
                group: 2
            })
        } else {
            nodes.push({
                id: user.address,
                group: 1
            })
        }

        if (user.soldTo != null && user.soldToConnection != null) {
            user.soldTo.forEach((soldTo, index) => {

                let previous = 0;

                links.forEach((link) => {
                    if ((link.source == user.address || link.source == soldTo.address) && (link.target == user.address || link.target == soldTo.address)) {
                        previous = previous + 1;
                    }
                })

                if (previous % 2 == 0) {
                    links.push({
                        source: user.address,
                        target: soldTo.address,
                        curvature: 0.3 * previous,
                        token: user.soldToConnection.edges[index].token,
                        name: `price: ${user.soldToConnection.edges[index].price} SOL \n marketplace: ${user.soldToConnection.edges[index].marketplace} \n token: ${user.soldToConnection.edges[index].token}`
                    })
                } else {
                    links.push({
                        source: user.address,
                        target: soldTo.address,
                        token: user.soldToConnection.edges[index].token,
                        curvature: -0.3 * previous,
                        name: `price: ${user.soldToConnection.edges[index].price} SOL \n marketplace: ${user.soldToConnection.edges[index].marketplace} \n token: ${user.soldToConnection.edges[index].token}`
                    })
                }

            });
        }
    })

    return { nodes, links }
}
