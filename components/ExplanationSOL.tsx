import {Box, Stack, Text} from "@chakra-ui/react";
import Image from "next/image";

export default function ExplanationSOL() {
    return <Box w='70%' h='60%' bg='gray.100' borderRadius='lg' p='4' mb={3}>
        <Stack direction='column'>
            <Text textAlign="center" fontSize='2xl'>
                <b>Collection on Solana?</b>
            </Text>
            <br/>
            <Text textAlign="center" fontSize='l'>
                Please consider using the name from the URL (red underlined in image) of the collection on MagicEden
            </Text>
            <br/>
            <div>
                <Box margin='auto' width='100%' height='100%' borderRadius='lg' overflow='hidden'>
                    <Image
                        src={require('../assets/example_name.png')}
                        alt='example image'
                    />
                </Box>
            </div>
        </Stack>
    </Box>
}