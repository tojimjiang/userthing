# userthing

## Access this from the web at
- https://userthing-vps01.jimjiang.com/
  - May be unavailable after 2024-10-15 11:59:59 EST

## Get this running NOW
1. Go to the server folder `cd server`
2. Install dependencies `npm install`
3. Run it NOW! `npm run dev`

### Local Entrypoint
- http://localhost:8080

### Notes
1. This uses a react server for the benefits react gives getting a quick client side rendered app.
2. The server serves the built built react app with itself acting as API/Webhook server.
3. Use slack/bolt for their webhook/api.
    - Small note, can't really get a signal on install. See handler for more details.