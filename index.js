require("dotenv").config();
const express = require("express");
const { createEventAdapter } = require("@slack/events-api");
const axios = require("axios");
const { writeToFile } = require('./interactive')

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const apiUrl = "https://slack.com/api";

// Initialize
const slackEvents = createEventAdapter(slackSigningSecret);

const app = express();

app.use("/slack/events", slackEvents.requestListener());

if (process.env.NODE_ENV === "development") {
  app.use(express.json());
} else {
  app.use(express.urlencoded({ extended: true }))
}

const port = (process.env.NODE_ENV === "development") ? 3000 : process.env.PORT

const server = app.listen(port, () => {
  console.log(
    "Express web server is running on port %d in %s mode",
    server.address().port,
    app.settings.env
  );
});

const slaxios = axios.create({
  baseURL: apiUrl,
  headers: {
    Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
  },
});

// Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
slackEvents.on("app_home_opened", async (event) => {
  const args = {
    user_id: event.user,
    view: {
      type: "home",
      title: {
        type: "plain_text",
        text: "Keep notes!",
      },
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Welcome! Let's get started.",
          },
        },
        {
          type: "section",
          text: {
            type: "plain_text",
            text: "1️⃣ Create a GitHub repo",
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "+ GitHub repo",
            },
            value: "GitHub",
            url: "https://github.com/new",
            action_id: "button-action",
          },
        },
        {
          type: "section",
          text: {
            type: "plain_text",
            text: "2️⃣ Invite the good-day bot",
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "+ Good Day bot",
            },
            value: "GitHub",
            url: "https://github.com/new",
            action_id: "button-action",
          },
        },
        {
          type: "section",
          text: {
            type: "plain_text",
            text: "3️⃣ Verify your setup",
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "Verify",
            },
            value: "GitHub",
            url: "https://github.com/new",
            action_id: "button-action",
          },
        },
        {
          type: "image",
          title: {
            type: "plain_text",
            text: "image1",
            emoji: true,
          },
          image_url:
            "https://api.slack.com/img/blocks/bkb_template_images/onboardingComplex.jpg",
          alt_text: "image1",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Choose what time you would like to be prompted",
          },
          accessory: {
            type: "timepicker",
            initial_time: "16:00",
            placeholder: {
              type: "plain_text",
              text: "Select time",
              emoji: true,
            },
            action_id: "timepicker-action",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "This is a section block with a button.",
          },
        },
      ],
    },
  };
  try {
    const res = await slaxios.post(`views.publish`, args);
    console.log(res);
  } catch (e) {
    console.error(e);
  }
});

app.get("/", async (req, res) => {
  res.send("beep boop");
});

app.post("/interactive", async (req, res) => {
  // console.log(req.body)
  // console.log(req.body)
  // console.log(req.body.payload)
  const payload = JSON.parse(req.body.payload);
  console.log(payload)
    
  // writeToFile(req)
  // if (Array.isArray(body.payload)) {
  //   throw new Error(
  //     `malformed payload`
  //   )
  // }

  // const payload = JSON.parse(body.payload)
  // console.log(payload)
  // const isSubmitButton = isButtonSubmit(payload)

  /*
  if (!isSubmitButton) {
    res.sendStatus(200)
    return
  }
  */

  // context.log(req.body)
  // context.log(JSON.stringify(payload))

  
  
  res.sendStatus(200)
});