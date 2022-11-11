import { Box } from "@chakra-ui/react";

export default function NFT(props) {

    if (props.image.length == 0) {
        return <div></div>
    }

    return <Box height='20%' width='20%'>
        <Box borderRadius='lg' overflow='hidden'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={props.image}
                alt='example image'
            />
        </Box>
    </Box>
}