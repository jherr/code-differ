import { Grid, CssBaseline, Box } from "@mui/material";

import Preview from "./components/Preview";
import Timeline from "./components/Timeline";
import Toolbar from "./components/Toolbar";
import EditorSection from "./components/EditorSection";

import { BOTTOM_HEIGHT } from "./lib/constants";

function App() {
  return (
    <Box>
      <CssBaseline />
      <Grid container>
        <Grid
          item
          xs={6}
          sx={{
            maxHeight: `calc(100vh - ${BOTTOM_HEIGHT}px)`,
            height: `calc(100vh - ${BOTTOM_HEIGHT}px)`,
            backgroundColor: "black",
          }}
        >
          <EditorSection />
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            maxHeight: `calc(100vh - ${BOTTOM_HEIGHT}px)`,
            height: `calc(100vh - ${BOTTOM_HEIGHT}px)`,
            overflow: "scroll",
            backgroundColor: "black",
          }}
        >
          <Preview />
        </Grid>
        <Grid
          item
          xs={3}
          style={{
            maxHeight: BOTTOM_HEIGHT,
            height: BOTTOM_HEIGHT,
            backgroundColor: "black",
          }}
        >
          <Toolbar />
        </Grid>
        <Grid
          item
          xs={9}
          style={{
            maxHeight: BOTTOM_HEIGHT,
            height: BOTTOM_HEIGHT,
            backgroundColor: "black",
          }}
        >
          <Timeline />
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
