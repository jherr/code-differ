import React from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Switch,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

import { FONTS, Project } from "engine";

function Settings({
  open,
  project,
  onClose,
  onUpdate,
}: {
  open: boolean;
  onClose: () => void;
  project: Project;
  onUpdate: (project: Partial<Project>) => void;
}) {
  function onChange<Key extends keyof Project>(key: Key, value: Project[Key]) {
    onUpdate({
      [key]: value,
    });
  }

  return (
    <Dialog open={open}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          type="text"
          value={project.name}
          onChange={(e) => onChange("name", e.target.value)}
          sx={{
            width: "100%",
            mb: 3,
          }}
        />
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              label="Duration"
              type="number"
              value={project.totalTime}
              onChange={(e) => onChange("totalTime", +e.target.value)}
              sx={{
                width: "100%",
                mb: 3,
              }}
            />
          </Grid>
          <Grid item xs={8}>
            <FormControl fullWidth>
              <InputLabel
                id="font-label"
                sx={{
                  background: "white",
                  px: 1,
                }}
              >
                Font
              </InputLabel>

              <Select value={project.font} labelId="font-label">
                {Object.keys(FONTS)
                  .sort()
                  .map((f) => (
                    <MenuItem
                      key={f}
                      value={f}
                      selected={f === project.font}
                      onClick={() => onChange("font", f)}
                    >
                      {f}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Switch
                  value={project.showBackground}
                  onChange={(e) => onChange("showBackground", e.target.checked)}
                />
              }
              label="Background"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="speed-label">Speed</InputLabel>
              <Select
                labelId="speed-label"
                value={project.animationDuration}
                label="Speed"
                onChange={(e) => onChange("animationDuration", +e.target.value)}
              >
                <MenuItem value={0.1}>Fast</MenuItem>
                <MenuItem value={0.3}>Normal</MenuItem>
                <MenuItem value={0.6}>Slow</MenuItem>
                <MenuItem value={1}>Slowest</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default Settings;
