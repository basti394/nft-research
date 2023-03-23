import {element} from "prop-types";
import getTotalVolume from "../../../lib/getTotalVolume";
import getWashtradedVolume from "../../../lib/getWashtradedVolume";
import getWashtraderAmount from "../../../lib/getWashtraderAmount";
import getMarketplaceDistro from "../../../lib/getMarketplaceDistro";
import getWashtradesAmount from "../../../lib/getWashtradesAmount";
import getAmountWashTradedNFTs from "../../../lib/getAmountWashTradedNFTs";
import formatVolume from "../../../lib/Formatter/formatVolume";

export default async function handler(req, res) {
    const name = req.query.name;
    const token: string | undefined = req.query.token;


    let chain
    if (name.startsWith("0x")) {
        chain = "eth"
    } else {
        chain = "sol"
    }

    const totalVolumeNum: number = await getTotalVolume(name, token)
    const washtradedVolumeNum: number = await getWashtradedVolume(name, token)

    const amountOfWashtraders: number = await getWashtraderAmount(name, token)

    const amountOfWashtrades: number = await getWashtradesAmount(name, token)

    const amountWashTradedNFTs: number = await getAmountWashTradedNFTs(name, token)

    const washtradedVolume: string = await formatVolume(washtradedVolumeNum, chain)

    const ratioOfTotalVolumeToWashtradedVolume = washtradedVolumeNum/totalVolumeNum

    const marketplaceDistro = await getMarketplaceDistro(name, token, true)

    console.log({
        amountOfWashtraders: amountOfWashtraders,
        amountOfWashtrades: amountOfWashtrades,
        amountWashTradedNFTs: amountWashTradedNFTs,
        washtradedVolume: washtradedVolume,
        ratioOfVolumes: ratioOfTotalVolumeToWashtradedVolume,
        marketplaceDistro: marketplaceDistro
    })

    res.status(200).send({
        amountOfWashtraders: amountOfWashtraders,
        amountOfWashtrades: amountOfWashtrades,
        amountWashTradedNFTs: amountWashTradedNFTs,
        washtradedVolume: washtradedVolume,
        ratioOfVolumes: ratioOfTotalVolumeToWashtradedVolume,
        marketplaceDistro: marketplaceDistro
    })
}
