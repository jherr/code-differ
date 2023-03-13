import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";

import TimeField from "./TimeField";

function TimeDialog({
  time: startTime,
  open,
  onSave,
}: {
  time: number;
  open: boolean;
  onSave: (time: number | null) => void;
}) {
  const [time, setTime] = useState(startTime);
  useEffect(() => {
    setTime(startTime);
  }, [open]);

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle>Time</DialogTitle>
      <DialogContent>
        <Box mt={2}>
          <TimeField
            time={time}
            onChange={(e) => setTime(e)}
            onEnter={() => {
              onSave(time);
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          px: 1,
        }}
      >
        <Button
          onClick={() => onSave(null)}
          variant="outlined"
          color="secondary"
        >
          Cancel
        </Button>
        <Box
          sx={{
            flexGrow: 1,
          }}
        ></Box>
        <Button
          onClick={() => onSave(time)}
          variant="contained"
          color="primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TimeDialog;
