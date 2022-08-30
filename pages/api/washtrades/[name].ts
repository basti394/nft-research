import {element} from "prop-types";
import getTotalVolume from "../../../lib/getTotalVolume";
import getWashtradedVolume from "../../../lib/getWashtradedVolume";
import getWashtraderAmount from "../../../lib/getWashtraderAmount";

export default async function handler(req, res) {
    const name = req.query.name;

    const amountOfWashtraders: number = await getWashtraderAmount(name)

    const washtradedVolume: number = await getWashtradedVolume(name)

    const totalVolume: number = await getTotalVolume(name)

    const ratioOfTotalVolumeToWashtradedVolume = washtradedVolume/totalVolume

    console.log({
        amountOfWashtraders: amountOfWashtraders,
        washtradedVolume: washtradedVolume,
        ratioOfVolumes: ratioOfTotalVolumeToWashtradedVolume
    })

    res.status(200).send({
        amountOfWashtraders: amountOfWashtraders,
        washtradedVolume: washtradedVolume,
        ratioOfVolumes: ratioOfTotalVolumeToWashtradedVolume
    })
}