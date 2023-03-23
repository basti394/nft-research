import {Box, Stack, Text} from "@chakra-ui/react";
import Image from "next/image";

export default function ExplanationETH() {
    return <Box w='70%' bg='gray.100' borderRadius='lg' p='4' mb={3}>
        <Text textAlign="center" fontSize='2xl'>
            <b>Collection on Ethereum?</b>
        </Text>
        <br/>
        <Text textAlign="center" fontSize='l'>
            Please consider using the address of collections smart contract.
        </Text>
        <br/>
        <Stack direction='row'>
            <Box margin='auto' width='50%' height='100%' borderRadius='lg' overflow='hidden'>
                <Image
                    src={require('../assets/exampleETHOpenSea.png')}
                    alt='example image'
                />
            </Box>
            <Text textAlign="center" fontSize='2xl'>→</Text>
            <Box margin='auto' width='50%' height='100%' borderRadius='lg' overflow='hidden'>
                <Image
                    src={require('../assets/ExampleETHEtherscan.png')}
                    alt='example image'
                />
            </Box>
        </Stack>
    </Box>
}