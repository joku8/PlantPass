import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

function Calculator() {
  const initialQuantities = {
    twoInchQty: 0,
    fourInchQty: 0,
    threePackQty: 0,
    fourPackQty: 0,
    fiveHalfSixInchQty: 0,
    decorativeQty: 0,
    fiveGallonQty: 0,
  };

  const initialTotals = {
    subtotal: 0,
    discount: 0,
    grandTotal: 0,
    bloomingStatus: "Not Applied",
  };

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setQuantities({ ...quantities, [name]: value === "" ? "" : Number(value) });
  };

  const calculateTotal = () => {
    const subtotal = Object.keys(quantities).reduce((acc, key) => {
      const quantity = parseFloat(quantities[key]) || 0;
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
      grandTotal: grandTotal.toFixed(2),
      bloomingStatus:
        totalItems >= 20 ? "Automatically Applied" : "Not Applied",
    });

    // Preparing data to be sent to the Google Apps Script web app.
    const postData = {
      timestamp: new Date().toISOString(),
      quantity: totalItems,
      order_total: grandTotal.toFixed(2),
    };

    // Sending data to the Google Apps Script web app using a POST request.
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
      .then((response) => {
        console.log("Data sent successfully");
        // You can implement additional logic here to handle the response if needed.
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
  };

  const handleNewOrder = () => {
    setQuantities(initialQuantities);
    setTotals(initialTotals);
    setIsPerennialPowerhouse(false);
  };

  const togglePerennialPowerhouse = () => {
    setIsPerennialPowerhouse(!isPerennialPowerhouse);
  };

  return (
    <Grid container spacing={2} direction="column">
      {Object.keys(prices).map((key) => (
        <TextField
          key={key}
          label={
            key
              .replace("Qty", "")
              .split(/(?=[A-Z])/)
              .join(" ") + ` $${prices[key].toFixed(2)}`
          }
          type="number"
          value={quantities[key]}
          onChange={handleInputChange}
          name={key}
          margin="normal"
          fullWidth
        />
      ))}
      <FormControlLabel
        control={
          <Checkbox
            checked={isPerennialPowerhouse}
            onChange={togglePerennialPowerhouse}
          />
        }
        label="Perennial Powerhouse (5%)"
      />
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
      <Typography>{`Subtotal: $${totals.subtotal}`}</Typography>
      <Typography>{`Discount: -$${totals.discount}`}</Typography>
      <Typography
        sx={{ fontWeight: "bold" }}
      >{`Grand Total: $${totals.grandTotal}`}</Typography>
      <Typography>{`Blooming Status: ${totals.bloomingStatus}`}</Typography>
    </Grid>
  );
}

export default Calculator;
