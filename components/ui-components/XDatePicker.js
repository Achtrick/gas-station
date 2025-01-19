import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";

function XDatePicker({ label, value, onChange }) {
  return (
    <DatePicker
      label={label}
      inputFormat="DD-MM-yyyy"
      value={moment(value, "DD-MM-yyyy")}
      color="black"
      renderInput={(params) => (
        <TextField
          size="small"
          sx={{
            backgroundColor: "white",
            "& .MuiFormLabel-root": {
              color: "#333 !important",
            },
            "& .MuiButtonBase-root": {
              color: "#333",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderRadius: "5px !important",
              border: "1px solid #ccc !important",
            },
          }}
          {...params}
        />
      )}
      onChange={onChange}
    />
  );
}

export default XDatePicker;
