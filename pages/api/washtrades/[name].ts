import {element} from "prop-types";
import getTotalVolume from "../../../lib/getTotalVolume";
import getWashtradedVolume from "../../../lib/getWashtradedVolume";
import getWashtraderAmount from "../../../lib/getWashtraderAmount";
import getMarketplaceDistro from "../../../lib/getMarketplaceDistro";

export default async function handler(req, res) {
    const name = req.query.name;
    const token: string | undefined = req.query.token;

    const amountOfWashtraders: number = await getWashtraderAmount(name, token)

    const washtradedVolume: number = await getWashtradedVolume(name, token)

    const totalVolume: number = await getTotalVolume(name, token)

    const ratioOfTotalVolumeToWashtradedVolume = washtradedVolume/totalVolume

    const marketplaceDistro = await getMarketplaceDistro(name, token)

    console.log({
        amountOfWashtraders: amountOfWashtraders,
        washtradedVolume: washtradedVolume,
        ratioOfVolumes: ratioOfTotalVolumeToWashtradedVolume,
        marketplaceDistro: marketplaceDistro
    })

    res.status(200).send({
        amountOfWashtraders: amountOfWashtraders,
        washtradedVolume: washtradedVolume,
        ratioOfVolumes: ratioOfTotalVolumeToWashtradedVolume,
        marketplaceDistro: marketplaceDistro
    })
}