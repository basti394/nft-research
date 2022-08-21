import { Box, Badge } from '@chakra-ui/react'
import dynamic from "next/dynamic";

const Graph = dynamic(() => import('../components/graph2d'), {
    ssr: false
})

export default function TokenGraph({ data }) {

    if (data.links.length == 0 && data.nodes.length == 0) return <div></div>

    const token = data.links[0].token

    return (
        <Box maxW='3xl' maxH='3xl' borderWidth='1px' borderRadius='lg' overflow='hidden' m={[2, 3]}>
            <Box p='6'>
                <Box
                    mt='1'
                    fontWeight='semibold'
                    as='h4'
                    lineHeight='tight'
                    noOfLines={1}
                >
                    {token}
                </Box>

                <Box>
                    <Graph data={data}></Graph>
                </Box>
            </Box>
        </Box>
    )
}