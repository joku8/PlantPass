import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { Snackbar, Alert } from "@mui/material";

function Calculator({ api }) {
  const initialQuantities = {
    twoInchQty: "",
    fourInchQty: "",
    threePackQty: "",
    fourPackQty: "",
    fiveHalfSixInchQty: "",
    decorativeQty: "",
    fiveGallonQty: "",
  };

  const initialTotals = {
    subtotal: 0,
    discount: 0,
    grandTotal: 0,
    bloomingStatus: "Not Applied",
  };

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [subtotals, setSubtotals] = useState(initialQuantities);
  const [quantities, setQuantities] = useState(initialQuantities);
  const [totals, setTotals] = useState(initialTotals);
  const [isPerennialPowerhouse, setIsPerennialPowerhouse] = useState(false);

  const prices = {
    twoInchQty: 3.0,
    fourInchQty: 5.0,
    threePackQty: 5.0,
    fourPackQty: 5.0,
    fiveHalfSixInchQty: 8.0,
    decorativeQty: 20.0,
    fiveGallonQty: 25.0,
  };

  const labelsDictionary = {
    twoInchQty: "Two Inch",
    fourInchQty: "Four Inch",
    threePackQty: "Three Pack",
    fourPackQty: "Four Pack",
    fiveHalfSixInchQty: "5.5 Inch / 6 Inch",
    decorativeQty: "Decorative",
    fiveGallonQty: "Five Gallon",
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const validValue = value.match(/^\d*$/) ? value : "";

    setQuantities({
      ...quantities,
      [name]: validValue,
    });

    const numericValue = validValue === "" ? 0 : parseFloat(validValue);
    setSubtotals({
      ...subtotals,
      [name]: (numericValue * prices[name]).toFixed(2),
    });
  };

  const calculateTotal = () => {
    const subtotal = Object.keys(quantities).reduce((acc, key) => {
      const quantityStr = quantities[key];
      const quantity = quantityStr === "" ? 0 : parseFloat(quantityStr);
      return acc + prices[key] * quantity;
    }, 0);

    const totalItems = Object.values(quantities).reduce(
      (acc, quantity) => acc + (parseFloat(quantity) || 0),
      0
    );

    const discountBlooming = totalItems >= 20 ? 0.05 : 0;
    const totalDiscountRate = isPerennialPowerhouse
      ? discountBlooming + 0.05
      : discountBlooming;
    const totalDiscount = subtotal * totalDiscountRate;
    const grandTotal = subtotal - totalDiscount;

    setTotals({
      subtotal: subtotal.toFixed(2),
      discount: totalDiscount.toFixed(2),
      grandTotal: Math.floor(grandTotal).toFixed(2),
      bloomingStatus:
        totalItems >= 20 ? "Automatically Applied" : "Not Applied",
    });

    const postData = {
      delete_: false,
      transaction_id: uuidv4(),
      timestamp: new Date().toISOString(),
      quantity: totalItems,
      order_total: Math.floor(grandTotal),
    };

    fetch(api, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then(() => {
        console.log("Data sent successfully: ", postData);
        setOpenSnackbar(true);
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleNewOrder = () => {
    setQuantities(initialQuantities);
    setSubtotals(initialQuantities);
    setTotals(initialTotals);
    setIsPerennialPowerhouse(false);
  };

  const togglePerennialPowerhouse = () => {
    setIsPerennialPowerhouse(!isPerennialPowerhouse);
  };

  return (
    <Grid container spacing={2} direction="column">
      <Grid item xs={12}>
        {Object.keys(prices).map((key) => (
          <Grid
            container
            item
            xs={12}
            key={key}
            alignItems="center"
            spacing={2}
          >
            <Grid item xs={10}>
              <TextField
                label={`${labelsDictionary[key]} $${prices[key].toFixed(2)}`}
                type="text" // Change type to text to allow intermediate invalid entries to be handled
                value={quantities[key]}
                onChange={handleInputChange}
                name={key}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              <Typography align="right">
                ${subtotals[key] === "" ? "0.00" : subtotals[key]}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          sx={{ marginLeft: 0 }}
          labelPlacement="start"
          control={
            <Checkbox
              checked={isPerennialPowerhouse}
              onChange={togglePerennialPowerhouse}
            />
          }
          label={
            <Typography component="span" sx={{ fontWeight: "bold" }}>
              Perennial Powerhouse (5%):
            </Typography>
          }
        />
        <Typography sx={{ marginBottom: "15px" }}>
          <span style={{ fontWeight: "bold" }}>Blooming Bundle (5%):</span>{" "}
          (Will be applied automatically)
        </Typography>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={calculateTotal}
          >
            Calculate
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleNewOrder}
          >
            New Order
          </Button>
        </Grid>
      </Grid>
      <Typography
        sx={{ marginTop: "15px" }}
      >{`Subtotal: $${totals.subtotal}`}</Typography>
      <Typography>{`Discount: -$${totals.discount}`}</Typography>
      <Typography
        sx={{ fontWeight: "bold" }}
      >{`Grand Total: $${totals.grandTotal}`}</Typography>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Order Recorded
        </Alert>
      </Snackbar>
    </Grid>
  );
}

export default Calculator;
