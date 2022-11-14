import {Flex, Spacer, Stack, Box, Text, Wrap} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import numberWithCommas from "../lib/numberWithComma";

export default function CollectionWTInformation(props) {

    const [ volumeInEur, setVolumeInEur ] = useState("0")

    useEffect(() => {
        const solPrice = props.solPrice
        const totalWashtradingVolume = props.totalWashTradedVolume.toFixed(2)

        const volumeInEur: string = (solPrice * totalWashtradingVolume).toFixed(2)
        setVolumeInEur(numberWithCommas(volumeInEur))
    }, [props.solPrice, props.totalWashTradedVolume])

    return <div>
        <Box w='100%' bg='gray.100' borderRadius='lg' p='4'>
            <Wrap justify='center'>
                <Stack direction='column' align='center'>
                    <Text as='b'>Wash Trades</Text>
                    <Text fontSize='3xl'>{numberWithCommas(props.washTrades)}</Text>
                </Stack>
                <Spacer/>
                <Stack direction='column' align='center'>
                    <Text as='b'>Wash Trader</Text>
                    <Text fontSize='3xl'>{numberWithCommas(props.washTrader)}</Text>
                </Stack>
                <Spacer/>
                <Stack direction='column' align='center'>
                    <Text as='b'>Wash Traded NFTs</Text>
                    <Text fontSize='3xl'>{numberWithCommas(props.washTradedNFTs)}</Text>
                </Stack>
            </Wrap>
            <br/>
            <br/>
            <Wrap spacing='30px' justify='left'>
                <Stack direction='column' align='center'>
                    <Text as='b'>Wash Traded Volume</Text>
                    <Text fontSize='3xl'>◎{numberWithCommas(props.totalWashTradedVolume.toFixed(2))} (≈ {volumeInEur}€)</Text>
                </Stack>
                <Stack direction='column' align='center'>
                    <Text as='b'>Volume Ratio</Text>
                    <Text fontSize='3xl'>{props.volumeRatio.toFixed(2)}%</Text>
                </Stack>
            </Wrap>
        </Box>
    </div>
}