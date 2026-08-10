import TextField from '@mui/material/TextField';

const InputField = ({
    placeHolder,
    inputVariable,
    handleInputChange,
}) => {
    return(
        <TextField
            fullWidth
            size="small"
            placeholder={placeHolder}
            value={inputVariable}
            onChange={handleInputChange}
        />
    )
};

export default InputField;