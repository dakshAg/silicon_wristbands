# Silicone Wristbands
A NextJS web app for made for [Silicone Wristbands](https://siliconewristbandsaustralia.com.au/) using [Merchi](https://merchi.co/) SDK.

## Features
- Product Listings
- Product Customisation and Live Cost Estimates
- Cart
- Payment Using [Stripe](https://stripe.com/au)

## Notable Files
- [merchi-ssr.js](https://github.com/dakshAg/silicon_wristbands/blob/main/src/utils/merchi-ssr.js) defines 2 functions to use Merchi SDK networking procedues within NextJS getServerSideProps. See [index.jsx](https://github.com/dakshAg/silicon_wristbands/blob/main/src/pages/index.jsx) and [[id].jsx](https://github.com/dakshAg/silicon_wristbands/blob/main/src/pages/order/%5Bid%5D.jsx) for usage
- [delete_local.jsx](https://github.com/dakshAg/silicon_wristbands/blob/main/src/pages/cart/delete_local.jsx) is not provided to the user, is only for testing

## Possible Next Steps
- Extend SSR to all pages
- Use Cookies instead of local storage to store Cart and Session
- UI Improvement

DDx