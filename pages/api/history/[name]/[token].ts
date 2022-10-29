import {getToken} from "@neo4j/graphql/dist/utils/get-token";
import getTransaktionOfToken from "../../../../lib/getTransaktionOfToken";
import formatHistoryData from "../../../../lib/Formatter/formatHistoryData";
import getData from "../../../../lib/getData";
import getWashTraders from "../../../../lib/getWashtraders";
import getAmountTrades from "../../../../lib/getAmountTrades";
import getAmountTradedNFTs from "../../../../lib/getAmountTradedNFTs";
import getTotalVolume from "../../../../lib/getTotalVolume";
import getTokenImage from "../../../../lib/getTokenImage";
import getMarketplaceDistro from "../../../../lib/getMarketplaceDistro";

export default async function handler(req, res) {
    const name = req.query.name;
    const token = req.query.token

    console.log(name)
    console.log(token)

    const tokenHistory = await getTransaktionOfToken(name, token)

    const washTraders = await getWashTraders(name)

    const formattedData = formatHistoryData(tokenHistory, washTraders)

    const amountTrades = await getAmountTrades(name, token)

    const amountTradedNFTs = await getAmountTradedNFTs(name, token)

    const amountTrader = formattedData.nodes.length

    const totalTradingVolume = await getTotalVolume(name, token)

    const imageUrl = await getTokenImage(token)

    const marketplaceDistro = await getMarketplaceDistro(name, token, false)

    res.status(200).send({
        data: formattedData,
        amountTrades: amountTrades,
        amountTradedNFTs: amountTradedNFTs,
        amountTrader: amountTrader,
        totalTradingVolume: totalTradingVolume,
        imageUrl: imageUrl,
        marketplaceDistro: marketplaceDistro
    });
}