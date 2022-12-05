
## Getting Started

First install all the dependencies:
```bash
npm install
or
yarn install
```

Then, run the development server:

```bash
npm run dev
or 
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the website.

To build the project and run the built version (for better UX especially with the graph), run following commands:
```bash
npm run build
or 
yarn build

npm run start
or
yarn start
```
Note: If you don't have a `.env.local` file, please reach out to me (s.o.jung@web.de). 

## Structure

The frontend code for the website can be inspected in `pages/index.tsx`. Single UI components can be found in `components/`

All API endpoints can be found in `pages/api/`. The URL to the endpoints is simply their path (eg. http://localhost:3000/api/history/{name}).

All methods called in the backend to calculate important statistics can be found in `lib/`.

## Tests

To check if the algorithm explained in the paper works properly, just run:
```bash
npm test
or 
yarn test
```