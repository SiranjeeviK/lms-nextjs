## vinoth 

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

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

9. Run the following command to create a new webhook. Make sure to replace `localhost:3000` with your own domain name if production. Don't close the terminal after running this command, this is where the webhook will be listening for events. The logs like payment success, payment failure, etc will be displayed here.

   ```bash
    stripe listen --forward-to localhost:3000/api/webhook
   ```

10. Copy the webhook signing secret and add it to your `.env.local` file or `.env` file

    ```bash
        STRIPE_WEBHOOK_SECRET=
    ```

11. Try to make a payment on your website and check the terminal to see if the webhook is being triggered. For successful payments, you can use Stripe's test card number `4242 4242 4242 4242` with any future expiry date and any CVC number.
