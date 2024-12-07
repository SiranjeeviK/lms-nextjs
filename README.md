# Stripe Setup

1. Create a Stripe account (US account)

2. Create a new sandbox account

3. Make sure the Stripe API key (Secret key) is added to your `.env.local` file or `.env` file

   ```bash
       STRIPE_API_KEY=
   ```

4. Download the Stripe CLI, you will be redirected to their github releases page
   (I downloaded the `stripe_1.22.0_windows_x86_64`)

5. Extract the downloaded file and add the extracted folder to your PATH

6. Restart your VS Code

7. Run `stripe login` in your terminal

8. Click on the link that appears in your terminal and login to your stripe account and click allow or athorize

9. Run the following command to create a new webhook. Make sure to replace `localhost:3000` with your own domain name if production. Don't close the terminal after running this command, this is where the webhook will be listening for events. The logs like payment success, payment failure, etc will be displayed here. NOTE: Without this command, the webhook will not work and payments will not be successful.

   ```bash
    stripe listen --forward-to localhost:3000/api/webhook
   ```

10. Copy the webhook signing secret and add it to your `.env.local` file or `.env` file

    ```bash
        STRIPE_WEBHOOK_SECRET=
    ```

11. Try to make a payment on your website and check the terminal to see if the webhook is being triggered. For successful payments, you can use Stripe's test card number `4242 4242 4242 4242` with any future expiry date and any CVC number.

# How to run the project

- Clone the project

- Run `npm install` to install all the dependencies

- Make sure to add the `.env.local` file with the required environment variables based on the `.env.example` file

- Complete the Stripe setup as mentioned above

- Run `npm run dev` to start the development server

- Open [http://localhost:3000](http://localhost:3000) to view it in the browser

# Troubleshooting

- If you face any issues with the Stripe CLI, make sure to check the [Stripe CLI documentation](https://stripe.com/docs/stripe-cli)

- When you purchase the course and the payment is successful, you will be redirected to the course page. If you refresh the page, you will see the course as purchased. But If it not reflect as purchased, you can check the terminal where the webhook is running to see if the payment was successful or not, and try to purchase the course again.
