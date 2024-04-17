# PlantPass Calculator: Spring Plant Fair 2024

The PlantPass Calculator is a web-based tool designed to assist cashiers for the Spring Plant Fair 2024. It enables users to calculate the total cost of a customer's order while automatically applying relevant discounts.

## Features

- **Responsive Design**: Adapts seamlessly to both desktop and mobile devices, ensuring user-friendly access across all platforms.
- **Interactive User Interface**: Provides straightforward input options for each plant category, allowing for easy entry of desired quantities.
- **Applying Discount**:
  - **Perennial Powerhouse Discount**: Users can apply a 5% discount for a order containing 5+ perennials by checking the corresponding option.
  - **Blooming Bundle Discount**: Automatically applies a 5% discount when the total quantity of plants reaches 20 or more.

## Usage

1. **Input Quantities**: For each pot size, input the number the customer wishes to purchase.
2. **Apply Discounts**: Select the Perennial Powerhouse discount if desired. The Blooming Bundle discount will apply automatically once eligible quantities are entered.
3. **Calculate**: Click the 'Calculate' button to see the total, including a breakdown of costs per plant type, applicable discounts, and the final amount.
4. **Track**: You can track all previous transactions and delete if needed.

## Backend
The backend was powered by Google App Scripts and Google Sheets. The web-app was able to post and fetch to a google spreadsheet that has the unique order id, timestamp, quantity, and order total. This was used for data analysis after the event was over

## Customization and Maintenance

- Easily add new plant types or change existing ones within the HTML structure.
- Adjust discount rates or conditions by updating the JavaScript functions.

## Future Work

If given more time, more care could have been given to the type of data collected. This data is valueble because it would influence the plants we grow in the future
- Track the type of pot sizes purchased per order
- Record the specific plants purchased (Most important piece of data, but hard to collect)
- Deploying this on the cloud with an actual backend would result in a more robust app. Using google app scripts was easy, but fetching time was slow.

## Hosting and Deployment

This app was deployed on Github pages and used to track more than 570 transactions and recorded over $20,000 in sales on the day of the 2024 Spring Plant Fair hosted by the UIUC Horticulture Club on April 13, 2024.