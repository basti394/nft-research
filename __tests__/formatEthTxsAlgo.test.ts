import getWTSCCs from "../lib/getWTSCCs";
import {expect} from "@jest/globals";

describe('SCC detecting Algorithm', function() {

    test('test for normal values', () => {
        const transfers = [
            {
                hash: "a",
                price: 5,
                priceAssumed: false,
            },
            {
                hash: "a",
                price: 5,
                priceAssumed: false,
            },
            {
                hash: "a",
                price: 5,
                priceAssumed: false,
            },
            {
                hash: "a",
                price: 5,
                priceAssumed: false,
            },
            {
                hash: "a",
                price: 5,
                priceAssumed: false,
            },


            {
                hash: "b",
                price: 3,
                priceAssumed: false,
            },
            {
                hash: "b",
                price: 3,
                priceAssumed: false,
            },

            {
                hash: "c",
                price: 10,
                priceAssumed: false,
            },
        ]

        const exp = [
            {
                hash: "a",
                price: 1,
                priceAssumed: true,
            },
            {
                hash: "a",
                price: 1,
                priceAssumed: true,
            },
            {
                hash: "a",
                price: 1,
                priceAssumed: true,
            },
            {
                hash: "a",
                price: 1,
                priceAssumed: true,
            },
            {
                hash: "a",
                price: 1,
                priceAssumed: true,
            },


            {
                hash: "b",
                price: 1.5,
                priceAssumed: true,
            },
            {
                hash: "b",
                price: 1.5,
                priceAssumed: true,
            },

            {
                hash: "c",
                price: 10,
                priceAssumed: false,
            },
        ]

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

        expect(transfers).toStrictEqual(exp)
    })
})
