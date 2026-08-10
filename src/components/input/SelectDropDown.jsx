import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ALL_VALUES_KEY } from '../../maps/sort-helper.map';

const SelectDropDown = ({
    label,
    listOfItems,
    selectedItemValue,
    selectionHandler,
    isAllNeeded = false,
    minWidth = 160
}) => {
    return (
        <FormControl fullWidth size="small" sx = {{minWidth}}>
            <InputLabel id={`${label}-filter`}>
                {label}
            </InputLabel>
            <Select
                labelId={`${label}-filter`}
                value={selectedItemValue}
                label="Status"
                onChange={selectionHandler}
            >
                {isAllNeeded === false ?
                    <></>
                    :
                    <MenuItem value={ALL_VALUES_KEY}>
                        {ALL_VALUES_KEY}
                    </MenuItem>
                }
                {listOfItems.map((item) => (
                    <MenuItem key={item.key} value={item.value}>
                        {item.key}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
};

export default SelectDropDown;