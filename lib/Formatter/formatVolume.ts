import getETHPrice from "../getETHPrice";
import getSOLPrice from "../getSOLPrice";
import numberWithCommas from "../numberWithComma";

export default async function formatVolume(volume: number, chain: string): Promise<string> {

    let priceEur
    let symbol
    let volumeRounded
    let volumeInEurRouned

    console.log("chain: ", chain)

    if (chain == "eth") {
        priceEur = await getETHPrice()
        symbol = "Ξ"
    } else {
        priceEur = await getSOLPrice()
        symbol = "◎"
    }
    volumeRounded = numberWithCommas(volume.toFixed(2))
    volumeInEurRouned = numberWithCommas((volume * priceEur).toFixed(2))

    return `${volumeRounded}${symbol} (≈ ${volumeInEurRouned}€)`
}