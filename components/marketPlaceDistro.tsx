import { Box, TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react";
import formatMarketplace from "../lib/Formatter/formatMarketplace";
import numberWithCommas from "../lib/numberWithComma";

export default function MarketPlaceDistro(props) {

    return <div>
        <Box w='99%' bg='gray.100' borderRadius='lg' p='4' overflowX='scroll'>
            <TableContainer>
                <Table variant='simple'>
                    <TableCaption>Marketplace Distribution</TableCaption>
                    <Thead>
                        <Tr>
                            <Th fontSize='lg'>Marketplace</Th>
                            <Th fontSize='lg'>Trades</Th>
                            <Th fontSize='lg'>Wash Trades</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        { props.marketplaceDistro.map((value) => (
                            <Tr key='marketDistro'>
                                <Td fontSize='lg'>{formatMarketplace(value[0])}</Td>
                                <Td fontSize='lg'>{numberWithCommas(value[1])}</Td>
                                <Td fontSize='lg'>{numberWithCommas(value[2])}</Td>
                            </Tr>
                            ))
                        }
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    </div>
}