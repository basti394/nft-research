import {Select} from "@chakra-ui/react";

export default function CollectionSelect(data, onChange: (value: string) => void) {


    return <Select
        placeholder='Select option'
        mt={3}
        mr={3}
        onChange={(value) => {
            const { target } = value;

            if (target.type === 'select-one') {
                const selectValue: string = target.selectedOptions[0].value;
                onChange(selectValue)
            }
        }}
    >
        { data.collections.map((value) => (
            <option value={value} key={value}>{value}</option>
        ))
        }
    </Select>


}