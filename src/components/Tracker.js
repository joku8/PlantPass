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
  Box,
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
    return () => setLoading(false);
  }, [api]);

  const handleDelete = (transaction_id) => {
    setLoading(true);
    const postData = { delete_: true, transaction_id };

    fetch(api, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then(() => {
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

  const getTotalSales = () =>
    records.reduce((total, record) => total + record.order_total, 0);

  const getTotalItemsSold = () =>
    records.reduce((total, record) => total + record.quantity, 0);

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
      <Grid item xs={12} sm={6} style={{ textAlign: "left" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Total Sales: ${getTotalSales()}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} style={{ textAlign: "right" }}>
        <Typography variant="h6">Items Sold: {getTotalItemsSold()}</Typography>
      </Grid>
      <Grid item xs={12}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <Typography variant="h6" style={{ fontWeight: "bold" }}>
                    Trash
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="h6" style={{ fontWeight: "bold" }}>
                    Order Total
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="h6" style={{ fontWeight: "bold" }}>
                    Quantity
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="h6" style={{ fontWeight: "bold" }}>
                    Timestamp
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record, index) => (
                <TableRow key={index}>
                  <TableCell align="center">
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDelete(record.transaction_id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">{`$${record.order_total}`}</TableCell>
                  <TableCell align="center">{record.quantity}</TableCell>
                  <TableCell align="center">
                    {new Date(record.timestamp).toLocaleString()}
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
