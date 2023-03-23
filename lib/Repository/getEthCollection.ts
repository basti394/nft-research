import {EvmChain} from "@moralisweb3/common-evm-utils";
import Moralis from "moralis";
import generateWeekList from "../generateWeekList";
import storeNewCollection from "../storeNewCollection";

export default async function getEthCollection(collection: string, from: Date, to: Date) {

    let dataMe = []

    try {
        await Moralis.start({
            apiKey: process.env.MORALIS_TOKEN,
        })
    } catch (error) {
        console.error(error);
    }

    console.log('Anfrage an moralis')

    const list = generateWeekList(from, to)

    console.log(list);

    await (async function () {
        for (const value of list) {
            const index = list.indexOf(value);
            const from = value
            const to = list[index + 1]
            console.log("------------------------------------------------")
            console.log(from)
            console.log(to)

            let temporaryData = await requestcollection(collection, from, to)

            await new Promise(f => setTimeout(f, 3000));

            console.log(temporaryData)

            console.log("store new collection")

            await storeNewCollection(collection, JSON.stringify(temporaryData), "eth");

            dataMe = dataMe.concat(temporaryData)
        }
    })();

    return dataMe
}

async function requestcollection(collection: string, from: Date, to: Date) {
    const chain = EvmChain.ETHEREUM;

    let cursor = null
    let transfers = [];
    do {
        const response = await Moralis.EvmApi.nft.getNFTContractTransfers({
            address: collection,
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