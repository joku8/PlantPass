import React from "react";
import { AppBar, Tabs, Tab, Typography, Box, Container } from "@mui/material";
import Calculator from "./components/Calculator";
import Tracker from "./components/Tracker";

var API_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwr1UOin3Oot7ERF0cgz6xHxwPx2Y6cZ6AVs9U6dfRqdWTG_tzBVkhwvtso6Skx8Q0/exec";

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

  var backgound = "#F6E7FF";
  var text = "#4AA870";

  return (
    <Container>
      <AppBar
        position="static"
        sx={{
          backgroundColor: backgound,
          color: text,
          borderRadius: "15px",
        }}
      >
        <Typography
          variant="h3"
          sx={{ fontWeight: "bold" }}
          align="center"
          component="div"
        >
          PlantPass
        </Typography>
        <Typography
          variant="h5"
          sx={{ fontWeight: 100 }}
          align="center"
          component="div"
        >
          Spring Plant Fair 2024
        </Typography>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          centered
        >
          <Tab label="Calculator" />
          <Tab label="Tracker" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Calculator api={API_ENDPOINT} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Tracker api={API_ENDPOINT} />
      </TabPanel>
    </Container>
  );
}
