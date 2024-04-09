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
  Grid,
  Box, // Import Box component for layout
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function Tracker({ api }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(api, {
      redirect: "follow",
      method: "GET",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Received Data: ", data);
        // Sort the data by timestamp, most recent first
        const sortedData = data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setRecords(sortedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
    // Cleanup function to cancel the loading state if the component unmounts
    return () => setLoading(false);
  }, [api]);

  const handleDelete = (transaction_id) => {
    setLoading(true); // Set loading before initiating delete
    const postData = {
      delete_: true,
      transaction_id: transaction_id,
    };

    // Replace YOUR_SCRIPT_ID with the actual ID of your Apps Script deployment.
    fetch(api, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then(() => {
        // Assuming the delete was successful, filter out the deleted record and update the state
        const updatedRecords = records.filter(
          (record) => record.transaction_id !== transaction_id
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
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={6} style={{ textAlign: "left" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Total Sales: ${getTotalSales()}
        </Typography>
      </Grid>
      <Grid item xs={6} style={{ textAlign: "right" }}>
        <Typography variant="h6">Items Sold: {getTotalItemsSold()}</Typography>
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
                      onClick={() => handleDelete(record.transaction_id)}
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
