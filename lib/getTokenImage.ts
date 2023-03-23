import Moralis from "moralis";
import {EvmChain} from "@moralisweb3/common-evm-utils";

export default async function getTokenImage(token: string, collection: string, chain: "eth" | "sol"): Promise<string> {

    let response
    let data
    if (chain == "sol") {
        response = await fetch(`https://api-mainnet.magiceden.dev/v2/tokens/${token}`)
        data = await response.json();
        return data.image;
    } else if (chain == "eth") {
        try {
            await Moralis.start({
                apiKey: "4MzaOgmsjNYREYDGfD6e32tdg4jx8y5sMS3swFwpxb2mTdh5qJQRjTxpgkalF8Z2"
            })
        } catch (error) {
            console.error(error);
        }
        response = await Moralis.EvmApi.nft.getNFTMetadata({
            address: collection,
            chain: EvmChain.ETHEREUM,
            tokenId: token,
        });
        console.log(response.jsonResponse.token_uri)
        return response.jsonResponse.token_uri
    }
}