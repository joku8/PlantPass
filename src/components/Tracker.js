import React, { useEffect, useState } from "react";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";

function Tracker() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = () => {
    fetch(
      "https://script.google.com/macros/s/AKfycbw37Bi5UcBDcE7jxQBJMupvRhOa30CDlRPnljxaKbPSDi-4CvaIXPkYxREa-OI4754/exec"
    )
      .then((response) => response.json())
      .then((data) => setRecords(data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  const deleteRecord = (timestamp) => {
    const postData = {
      delete: true,
      timestamp: timestamp,
    };

    fetch(
      "https://script.google.com/macros/s/AKfycbw37Bi5UcBDcE7jxQBJMupvRhOa30CDlRPnljxaKbPSDi-4CvaIXPkYxREa-OI4754/exec",
      {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      }
    )
      .then(() => {
        // After deletion, fetch the updated records
        fetchRecords();
      })
      .catch((error) => console.error("Error deleting data:", error));
  };

  return (
    <List>
      {records.map((record, index) => (
        <ListItem key={index}>
          <ListItemText
            primary={`Order Total: $${record.order_total}`}
            secondary={`Timestamp: ${record.timestamp}, Quantity: ${record.quantity}`}
          />
          <ListItemSecondaryAction>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => deleteRecord(record.timestamp)}
            >
              Delete
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
}

export default Tracker;
