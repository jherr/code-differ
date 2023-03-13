import React, { useState } from "react";
import { TextField } from "@mui/material";

function TimeField({
  time: startTime,
  onChange,
  onEnter,
}: {
  time: number;
  onChange: (time: number) => void;
  onEnter?: () => void;
}) {
  const [time, setTime] = useState(startTime.toString());

  const onTextChange = (value: string) => {
    setTime(value);
    if (value.includes(":")) {
      const [minutes, seconds] = value.split(":");
      onChange(+minutes * 60 + +seconds);
    } else {
      onChange(+value);
    }
  };

  return (
    <TextField
      label="Time (seconds)"
      type="text"
      value={time}
      onChange={(e) => onTextChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          onEnter?.();
        }
      }}
      sx={{
        width: "100%",
      }}
    />
  );
}

export default TimeField;
