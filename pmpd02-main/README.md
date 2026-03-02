student helper, react edition

---

design notes:
due to time constraints (and lack of knowledge in react), i was unable to follow the design fully, which lead to the app (the desktop version in particular) diverging in looks and functionality
here is a small list of changes:

for mobile:
the mobile version should look identical, as this is what i was aiming for first
there may be a few subtle differences, like the addition of a back button in the calendar page

for desktop:
a lot of the changes on the desktop layout are simply for parity with the mobile layout
- all: the header stays the same height on all pages, and buttons shown on the header in the design are moved
- login: should look identical, aside from the task previews looking different; lily mostly took over for this one
- dashboard: unfortunately, i was unable to implement the task creation dialogue being split off to the right like shown in the design (as well as that plus button); i opted for a popup that is created above an "add task" button instead
- settings: certain elements (like the user info section and the save/go back buttons) are the same as mobile 
- calendar: completely redesigned, as the design for the calendar was unfinished

---

This is a [Next.js](This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun devhttps://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
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