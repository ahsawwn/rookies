# GitHub Issue: Checkout Redirect Bug

## Title
[BUG] Proceed to Checkout button redirects to home page instead of checkout page

## Description
When a user clicks the "Proceed to Checkout" button in the cart page, they are redirected back to the home page instead of being taken to the checkout page.

## Steps to Reproduce
1. Add items to the cart
2. Navigate to the cart page (`/cart`)
3. Click the "Proceed to Checkout" button
4. Observe that the user is redirected to the home page (`/`) instead of the checkout page (`/checkout`)

## Expected Behavior
The user should be redirected to the checkout page (`/checkout`) when clicking "Proceed to Checkout" from the cart.

## Actual Behavior
The user is redirected to the home page (`/`) instead.

## Environment
- Browser: Any
- Device: Any
- URL: `/cart`

## Labels
- `bug`
- `cart`
- `checkout`
- `priority-medium`

## Additional Context
This issue needs to be fixed to ensure a smooth checkout flow for users. The checkout button is located in `app/cart/page.tsx` around line 219-232.

