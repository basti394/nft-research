import checkIfCollectionIsStored from "../../../../lib/checkIfCollectionIsStored";
import storeNewCollection from "../../../../lib/storeNewCollection";
import formatToGraphData from "../../../../lib/Formatter/formatToGraphData";
import markAddressAsWashTrader from "../../../../lib/markAddressAsWashtrader";
import markTransactionAsWashtrade from "../../../../lib/markTransactionAsWashtrade";
import getData from "../../../../lib/getData";
import formatHistoryData from "../../../../lib/Formatter/formatHistoryData";
import getAmountTrades from "../../../../lib/getAmountTrades";
import getAmountTradedNFTs from "../../../../lib/getAmountTradedNFTs";
import getTotalVolume from "../../../../lib/getTotalVolume";
import getWashTraders from "../../../../lib/getWashtraders";
import getMarketplaceDistro from "../../../../lib/getMarketplaceDistro";
import getWTSCCs from "../../../../lib/getWTSCCs";
import Moralis from "moralis";
import {EvmChain} from "@moralisweb3/common-evm-utils";
import formatVolume from "../../../../lib/Formatter/formatVolume";
import getTransactionTimeSpan from "../../../../lib/getTransactionTimeSpan";
import getEthCollection from "../../../../lib/Repository/getEthCollection";
import getSolCollection from "../../../../lib/Repository/getSolCollection";

const threshold = 5

export default async function handler(req, res) {
    const name = req.query.name;

    let isCollectionStored;

    try {
        isCollectionStored = await checkIfCollectionIsStored(name);
    } catch (e) {
        res.status(500).send(e);
        return;
    }

    let dataMe: any[][] = []
    let chain: "sol" | "eth"

    if (name.startsWith("0x")) {
        chain = "eth"
    } else {
        chain = "sol"
    }

    if (!isCollectionStored) {
        if (chain == "eth") {

            const fromOrigin = new Date("2021-1-1")

            try {
                dataMe = await getEthCollection(name, fromOrigin, new Date())
            } catch (e) {
                if (e == "unexpected error") {
                    res.status(500);
                }
            }

        } else {
            console.log('Anfrage an MagicEden')

            dataMe = await getSolCollection(name)

            console.log("Received Data from Magic Eden")

            let newArr = [];

            for (let i = 0; i < dataMe.length; i++) {
                newArr = newArr.concat(dataMe[i]);
            }

            console.log("filtering list")

            dataMe = newArr.filter((element) => element.type == "buyNow")
            console.log("store new collection")

            await storeNewCollection(name, JSON.stringify(dataMe), chain);
        }

        const formattedDataME = formatToGraphData(dataMe, chain)

        const allNodes = formattedDataME.nodes
        const allLinks = formattedDataME.links

        const wtSCCs = getWTSCCs(allNodes, allLinks, threshold)

        console.log('wtSCC. ', wtSCCs)

        for (const scc of wtSCCs) {
            for (const element1 of scc) {
                await markAddressAsWashTrader(element1, name);
            }
        }

        for (const scc of wtSCCs) {
            for (const element2 of scc) {
                console.log(element2)
                for (const element1 of scc.filter((element) => element != element2)) {
                    console.log("|______", element1)
                    await markTransactionAsWashtrade(element2, element1, name)
                }
            }
        }
    }

    const data = await getData(name)

    const washtraderSet = await getWashTraders(name)

    const formattedData = formatHistoryData(data, washtraderSet, chain)

    const amountTrades = await getAmountTrades(name, null)

    const amountTradedNFTs = await getAmountTradedNFTs(name, null)

    const amountTrader = formattedData.nodes.length

    const totalTradingVolume = await formatVolume(await getTotalVolume(name, undefined), chain)

    const marketplaceDistro = await getMarketplaceDistro(name, undefined, false)

    const transactionTimeSpan = await getTransactionTimeSpan(name, undefined)

    console.log({
        data: formattedData,
        amountTrades: amountTrades,
        amountTradedNFTs: amountTradedNFTs,
        amountTrader: amountTrader,
        totalTradingVolume: totalTradingVolume,
        marketplaceDistro: marketplaceDistro,
        transactionTimeSpan: transactionTimeSpan
    })

    res.status(200).send({
        data: formattedData,
        amountTrades: amountTrades,
        amountTradedNFTs: amountTradedNFTs,
        amountTrader: amountTrader,
        totalTradingVolume: totalTradingVolume,
        marketplaceDistro: marketplaceDistro,
        transactionTimeSpan: transactionTimeSpan
    });
}

async function requestFromME(name: string): Promise<any> {

    let list = []

    let lastData = [""];

    for (let i = 0; i < 3000; i++) {
        if (lastData.length == 0) {
            break;
        }
        console.log("sending request ", i)
        console.log("amount to receive ", i * 100)
        const response = await fetch(`https://api-mainnet.magiceden.dev/v2/collections/${name}/activities?offset=${i * 100}&limit=100`)
        console.log("received response: ", response.status)
        if (response.status == 429) {
            await new Promise(f => setTimeout(f, 30000));
            i--;
            continue;
        }
        if (response.status == 400) {
            break;
        }
        const data = await response.json();
        if (response.status != 200) {
            console.log("data: ", data)
        }
        lastData = data;
        console.log('data length ',data.length)
        console.log("-----------------------------------------")
        list.push(data)
    }

    return list
}

async function requestFromMoralis(address: string, from: Date, to: Date) {

    const chain = EvmChain.ETHEREUM;

    let cursor = null
    let transfers = [];
    do {
        const response = await Moralis.EvmApi.nft.getNFTContractTransfers({
            address,
            chain,
            fromDate: from,
            toDate: to,
            limit: 100,
            cursor: cursor,
        });
        console.log("response: ", response)
        console.log(
            `Got page ${response.raw.page} of ${Math.ceil(
                response.raw.total / response.raw.page_size
            )}, ${response.raw.total} total`
        );
        for (const transfer of response.result) {
            transfers.push({
                hash: transfer.transactionHash,
                buyer: transfer.toAddress.lowercase,
                seller: transfer.fromAddress.lowercase,
                price: Number(transfer.value.ether) / 1000000000000000000,
                priceAssumed: false,
                source: "unknown",
                tokenMint: transfer.tokenId,
                blockTime: transfer.blockTimestamp.getTime()/1000,
            })
        }
        cursor = response.raw.cursor;
    } while (cursor != "" && cursor != null);

    /*const transfers: any = [
        {
            hash: '1',
            buyer: 'a',
            seller: 'b',
            price: 20,
            priceAssumed: false,
            source: 'NA',
            tokenMint: '0xdbfd76af2157dc15ee4e57f3f942bb45ba84af24',
            blockTime: "2023-03-04T04:30:11.000Z",
        },
        {
            hash: '1',
            buyer: 'b',
            seller: 'a',
            price: 20,
            priceAssumed: false,
            source: 'NA',
            tokenMint: '67ij',
            blockTime: "2023-03-04T04:30:11.000Z",
        },
        {
            hash: '1',
            buyer: 'a',
            seller: 'b',
            price: 20,
            priceAssumed: false,
            source: 'NA',
            tokenMint: 'ztuk678',
            blockTime: "2023-03-04T04:30:11.000Z",
        },
        {
            hash: '1',
            buyer: 'b',
            seller: 'a',
            price: 20,
            priceAssumed: false,
            source: 'NA',
            tokenMint: '65jutzuj',
            blockTime: "2023-03-04T04:30:11.000Z",
        },
        {
            hash: '1',
            buyer: 'a',
            seller: 'b',
            price: 20,
            priceAssumed: false,
            source: 'NA',
            tokenMint: '5643',
            blockTime: "2023-03-04T04:30:11.000Z",
        },
        {
            hash: '1',
            buyer: 'b',
            seller: 'a',
            price: 20,
            priceAssumed: false,
            source: 'NA',
            tokenMint: 'asdfasfdasfasdf',
            blockTime: "2023-03-04T04:30:11.000Z",
        },
        {
            hash: '1',
            buyer: 'a',
            seller: 'b',
            price: 20,
            priceAssumed: false,
            source: 'NA',
            tokenMint: '0998',
            blockTime: "2023-03-04T04:30:11.000Z",
        },
        {
            hash: '1',
            buyer: 'b',
            seller: 'a',
            price: 20,
            priceAssumed: false,
            source: 'NA',
            tokenMint: 'sadfasdfasdf',
            blockTime: "2023-03-04T04:30:11.000Z",
        },
        {
            hash: '1',
            buyer: 'a',
            seller: 'b',
            price: 20,
            priceAssumed: false,
            source: 'NA',
            tokenMint: 'as4w5325d',
            blockTime: "2023-03-04T04:30:11.000Z",
        },
        {
            hash: '1',
            buyer: 'b',
            seller: 'a',
            price: 20,
            priceAssumed: false,
            source: 'NA',
            tokenMint: 'as86786578df',
            blockTime: "2023-03-04T04:30:11.000Z",
        },{
            hash: '1',
            buyer: 'a',
            seller: 'b',
            price: 20,
            priceAssumed: false,
            source: 'NA',
            tokenMint: '55656',
            blockTime: "2023-03-04T04:30:11.000Z",
        },
        {
            hash: '1',
            buyer: 'b',
            seller: 'a',
            price: 20,
            priceAssumed: false,
            source: 'NA',
            tokenMint: '4545456',
            blockTime: "2023-03-04T04:30:11.000Z",
        },{
            hash: '1',
            buyer: 'a',
            seller: 'b',
            price: 20,
            priceAssumed: false,
            source: 'NA',
            tokenMint: '7689',
            blockTime: "2023-03-04T04:30:11.000Z",
        },
        {
            hash: '1',
            buyer: 'b',
            seller: 'a',
            price: 20,
            priceAssumed: false,
            source: 'NA',
            tokenMint: 'dlfkgkdja',
            blockTime: "2023-03-04T04:30:11.000Z",
        },{
            hash: '1',
            buyer: 'a',
            seller: 'b',
            price: 20,
            priceAssumed: false,
            source: 'NA',
            tokenMint: 'fdnghzu',
            blockTime: "2023-03-04T04:30:11.000Z",
        },
        {
            hash: '1',
            buyer: 'b',
            seller: 'a',
            price: 20,
            priceAssumed: false,
            source: 'NA',
            tokenMint: 'as6df',
            blockTime: "2023-03-04T04:30:11.000Z",
        },


        {
            hash: '2',
            buyer: 'a',
            seller: 'b',
            price: 2,
            priceAssumed: false,
            source: 'NA',
            tokenMint: '0xdbfd76af2157dc15ee4e57f3f942bb45ba84af24',
            blockTime: "2023-03-04T04:30:11.000Z",
        },

        {
            hash: '5',
            buyer: 'b',
            seller: 'c',
            price: 3,
            priceAssumed: false,
            source: 'NA',
            tokenMint: '0xdbfd76af2157dc15ee4e57f3f942bb45ba84af24',
            blockTime: "2023-03-04T04:30:11.000Z",
        },
        {
            hash: '3',
            buyer: 'c',
            seller: 'a',
            price: 3,
            priceAssumed: false,
            source: 'NA',
            tokenMint: '0xdbfd76af2157dc15ee4e57f3f942bb45ba84af24',
            blockTime: "2023-03-04T04:30:11.000Z",
        },
        {
            hash: '3',
            buyer: 'a',
            seller: 'c',
            price: 3,
            priceAssumed: false,
            source: 'NA',
            tokenMint: '0xdbfd76af2157dc15ee4e57f3f942bb45ba84af24',
            blockTime: "2023-03-04T04:30:11.000Z",
        },

    ]*/

    let seenHash = new Array<{ hash: string, initialPrice: number, amount: number }>()
    transfers.forEach((transfer) => {
        if (seenHash.some((hashObj) => hashObj.hash == transfer.hash)) {
            seenHash.find((hash) => hash.hash == transfer.hash).amount ++;
        } else {
            seenHash.push({hash: transfer.hash, initialPrice: transfer.price, amount: 1})
        }
    })

    transfers.forEach((transfer) => {
        if (seenHash.filter((hashObj) => hashObj.hash == transfer.hash)[0].amount > 1) {
            let hashObj = seenHash.filter((hash) => hash.hash == transfer.hash)
            transfer.price = hashObj[0].initialPrice/hashObj[0].amount
            transfer.priceAssumed = true
        }
    })

    return transfers.filter((transfer) => transfer.price > 0);

}


