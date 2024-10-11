// src/index.js
import express, { Express, NextFunction, Request, Response } from "express";
let cors = require('cors')
import path from "path";
import { App, ExpressReceiver } from "@slack/bolt";
import { scrapeSlackUsers, handleQuery, addUser } from "./user_handler";
import { SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET } from "./secrets";

const app: Express = express();
const port: Number = Number(process.env.PORT) || 8080;

app.use(cors())
// app.use(express.json());


const boltReceiver = new ExpressReceiver({
    signingSecret: SLACK_SIGNING_SECRET,
    endpoints: "/",
});
const boltApp = new App({
    token: SLACK_BOT_TOKEN,
    receiver: boltReceiver,
});
const boltClient = boltApp.client;

app.use("/slack/events", boltReceiver.router);

boltApp.event("team_join", async ({ event, client, context }) => {
    console.log("user Joined team");
    addUser(event.user);
});

boltApp.event("user_profile_changed", async ({ event, client, context }) => {
    console.log("user profile change", event);
    addUser(event.user);
});

boltApp.event("user_status_changed", async ({ event, client, context }) => {
    console.log("user status changed", event);
    addUser(event.user);
});

boltApp.event("user_change", async ({ event, client, context }) => {
    console.log("user change", event);
    addUser(event.user);
});

boltApp.event("user_change", async ({ event, client, context }) => {
    console.log("user change", event);
    addUser(event.user);
});

// In theory we need to scrape on install, but this won't work without Slack Enterprise for the oAuth scope required for this event.
boltApp.event("app_installed", async({event, client, context}) => {
    console.log("app installed", event);
    scrapeSlackUsers(boltClient);
});

app.use(express.static(path.join(__dirname, '../../client/build')));

app.use((req: Request, res: Response, next: NextFunction) => {
    if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path) || /(slack\/events)|(query)/i.test(req.path)) {
        next();
    } else {
        res.sendFile(path.join(__dirname, '../../client/build/index.html'));
    }
});

app.post("/query", function (request, response) {
    if (request.headers.referer.includes('jimjiang.com')) {
        response.send(JSON.stringify(handleQuery()))
    }
    else {
        response.sendStatus(401)
    }
})

app.post("/sync", function (request, response) {
    if (request.headers.referer.includes('jimjiang.com')) {
        scrapeSlackUsers(boltClient);
        response.sendStatus(200);
    }
    else {
        response.sendStatus(401)
    }
})

app.listen(port, () => {
    scrapeSlackUsers(boltClient);
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
