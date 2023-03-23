import getTransaktionOfToken from "../../../../lib/getTransaktionOfToken";
import formatHistoryData from "../../../../lib/Formatter/formatHistoryData";
import getWashTraders from "../../../../lib/getWashtraders";
import getAmountTrades from "../../../../lib/getAmountTrades";
import getAmountTradedNFTs from "../../../../lib/getAmountTradedNFTs";
import getTotalVolume from "../../../../lib/getTotalVolume";
import getTokenImage from "../../../../lib/getTokenImage";
import getMarketplaceDistro from "../../../../lib/getMarketplaceDistro";
import formatVolume from "../../../../lib/Formatter/formatVolume";
import getTransactionTimeSpan from "../../../../lib/getTransactionTimeSpan";

export default async function handler(req, res) {
    const name = req.query.name;
    const token = req.query.token

    console.log(name)
    console.log(token)

    let chain
    if (name.startsWith("0x")) {
        chain = "eth"
    } else chain = "sol"

    const tokenHistory = await getTransaktionOfToken(name, token)

    const washTraders = await getWashTraders(name)

    const formattedData = formatHistoryData(tokenHistory, washTraders, chain)

    const amountTrades = await getAmountTrades(name, token)

    const amountTradedNFTs = await getAmountTradedNFTs(name, token)

    const amountTrader = formattedData.nodes.length

    const totalTradingVolume = await formatVolume(await getTotalVolume(name, token), chain)

    const imageUrl = await getTokenImage(token, name, chain)

    const marketplaceDistro = await getMarketplaceDistro(name, token, false)

    const transactionTImeSpan = await getTransactionTimeSpan(name, token)

    res.status(200).send({
        data: formattedData,
        amountTrades: amountTrades,
        amountTradedNFTs: amountTradedNFTs,
        amountTrader: amountTrader,
        totalTradingVolume: totalTradingVolume,
        imageUrl: imageUrl,
        marketplaceDistro: marketplaceDistro,
        transactionTimeSpan: transactionTImeSpan
    });
}