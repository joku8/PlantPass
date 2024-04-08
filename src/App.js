import React from "react";
import { AppBar, Tabs, Tab, Typography, Box, Container } from "@mui/material";
import Calculator from "./components/Calculator";
import Tracker from "./components/Tracker";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function App() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#FECC70",
          color: "#0D6260",
          borderRadius: "15px",
        }}
      >
        <Typography variant="h3" align="center" component="div">
          PlantPass
        </Typography>
        <Typography variant="h5" align="center" component="div">
          Spring Plant Fair 2024
        </Typography>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
          sx={{ ".MuiTabs-indicator": { backgroundColor: "#0D6260" } }}
        >
          <Tab label="Calculator" />
          <Tab label="Tracker" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Calculator />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Tracker />
      </TabPanel>
    </Container>
  );
}
