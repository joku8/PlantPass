import React, { useState, useEffect } from "react";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Button,
  Grid,
  Box, // Import Box component for layout
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function Tracker() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(
      "https://script.google.com/macros/s/AKfycbw37Bi5UcBDcE7jxQBJMupvRhOa30CDlRPnljxaKbPSDi-4CvaIXPkYxREa-OI4754/exec",
      {
        redirect: "follow",
        method: "GET",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Received Data: ", data);
        setRecords(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
    // Make sure to include the cleanup function to cancel the loading state if the component unmounts
    return () => setLoading(false);
  }, []);

  const handleDelete = (timestampToDelete) => {
    setLoading(true); // Set loading before initiating delete
    const postData = {
      delete: true,
      timestamp: timestampToDelete,
    };

    // Replace YOUR_SCRIPT_ID with the actual ID of your Apps Script deployment.
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
        // Assuming the delete was successful, filter out the deleted record and update the state
        const updatedRecords = records.filter(
          (record) => record.timestamp !== timestampToDelete
        );
        setRecords(updatedRecords);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error deleting the record:", error);
        setLoading(false);
      });
  };

  const getTotalSales = () => {
    return records.reduce((total, record) => total + record.order_total, 0);
  };

  const getTotalItemsSold = () => {
    return records.reduce((total, record) => total + record.quantity, 0);
  };

  const handleClearAll = () => {
    setLoading(true); // Set loading before initiating delete
    // Replace YOUR_SCRIPT_ID with the actual ID of your Apps Script deployment.
    fetch(
      "https://script.google.com/macros/s/AKfycbw37Bi5UcBDcE7jxQBJMupvRhOa30CDlRPnljxaKbPSDi-4CvaIXPkYxREa-OI4754/exec",
      {
        method: "POST",
        mode: "no-cors", // 'no-cors' prevents reading the response body, which is fine here
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deleteAll: true }),
      }
    )
      .then(() => {
        setRecords([]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error deleting all records:", error);
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Total Sales: ${getTotalSales()}
        </Typography>
        <Typography variant="h6">
          Total Items Sold: {getTotalItemsSold()}
        </Typography>
      </Grid>
      <Grid item xs={6} style={{ textAlign: "right" }}>
        <Button variant="contained" color="error" onClick={handleClearAll}>
          Clear All
        </Button>
      </Grid>
      <Grid item xs={12}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography
                    variant="h6"
                    style={{ fontWeight: "bold", textAlign: "center" }}
                  >
                    Timestamp{" "}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="h6"
                    style={{ fontWeight: "bold", textAlign: "center" }}
                  >
                    Order Total
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="h6"
                    style={{ fontWeight: "bold", textAlign: "center" }}
                  >
                    Quantity{" "}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="h6"
                    style={{ fontWeight: "bold", textAlign: "center" }}
                  >
                    Action
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ textAlign: "center" }}>
                    {new Date(record.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {`$${record.order_total}`}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {record.quantity}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDelete(record.timestamp)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}

export default Tracker;
