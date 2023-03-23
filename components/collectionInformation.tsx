import {Flex, Spacer, Stack, Box, Text, Wrap} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import numberWithCommas from "../lib/numberWithComma";

export default function CollectionInformation(props) {

    return <div>
        <Box w='100%' bg='gray.100' borderRadius='lg' p='4'>
            <Wrap>
                <Stack direction='column' align='center'>
                    <Text as='b'>Sales</Text>
                    <Text fontSize='3xl'>{numberWithCommas(props.amountTrades)}</Text>
                </Stack>
                <Spacer/>
                <Stack direction='column' align='center'>
                    <Text as='b'>Trader</Text>
                    <Text fontSize='3xl'>{numberWithCommas(props.amountTrader)}</Text>
                </Stack>
                <Spacer/>
                <Stack direction='column' align='center'>
                    <Text as='b'>Traded NFTs</Text>
                    <Text fontSize='3xl'>{numberWithCommas(props.amountTradedNFTs)}</Text>
                </Stack>
                <Spacer/>
                <Stack direction='column' align='center'>
                    <Text as='b'>Volume</Text>
                    <Text fontSize='3xl'>{props.totalTradingVolume}</Text>
                </Stack>
             </Wrap>
        </Box>
    </div>
}