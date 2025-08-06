import path from "path";
import { fileURLToPath } from "url";
import { Provider } from "ltijs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const lti = Provider;

// 1. Setup the LTI provider (with MongoDB Atlas)
await lti.setup(
  "supersecret", // JWT secret
  {
    url: "mongodb+srv://chhotu22:ioufDLeFolNHv4TR@lti.wfvxszi.mongodb.net/ltijs?retryWrites=true&w=majority&appName=lti",
  },
  {
    appRoute: "/",
    loginRoute: "/login",
    //keysetRoute: '/keys',
    cookies: {
      secure: false,
      sameSites: "None",
    },
    staticPath: path.join(__dirname, "./public"),
    devMode: true,
    dynRegRoute: "/register", // Setting up dynamic registration route. Defaults to '/register'
    dynReg: {
      url: "https://lti.csbasics.in/", // Tool Provider URL. Required field.
      name: "quize", // Tool Provider name. Required field.
      logo: "https://imgs.search.brave.com/Nh8VoS-LeggCpHsK1WyrJ93y5ZzhdvOHID1hEXXjp6Y/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAyLzQ3LzAwLzYy/LzM2MF9GXzI0NzAw/NjIzMl9RS2hJNlUy/RlByNDlrUEJBZ09C/a2tvWWhOQXBxbG5W/Mi5qcGc", // Tool Provider logo URL.
      description: "Tool Description", // Tool Provider description.
      redirectUris: ["https://lti.csbasics.in/launch"], // Additional redirection URLs. The main URL is added by default.
      //customParameters: { key: 'value' }, // Custom parameters.
      autoActivate: true, // Whether or not dynamically registered Platforms should be automatically activated. Defaults to false.
    },
  }
);

// 2. Define behavior when the tool is launched
lti.onConnect((token, req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// lti.app.post('/grade', async (req, res) => {
//   try {
//     const idtoken = res.locals.token // IdToken
//     const score = req.body.grade // User numeric score sent in the body
//     // Creating Grade object
//     const gradeObj = {
//       userId: idtoken.user,
//       scoreGiven: score,
//       scoreMaximum: 100,
//       activityProgress: 'Completed',
//       gradingProgress: 'FullyGraded'
//     }

//     // Selecting linetItem ID
//     let lineItemId = idtoken.platformContext.endpoint.lineitem // Attempting to retrieve it from idtoken
//     if (!lineItemId) {
//       const response = await lti.Grade.getLineItems(idtoken, { resourceLinkId: true })
//       const lineItems = response.lineItems
//       if (lineItems.length === 0) {
//         // Creating line item if there is none
//         console.log('Creating new line item')
//         const newLineItem = {
//           scoreMaximum: 100,
//           label: 'Grade',
//           tag: 'grade',
//           resourceLinkId: idtoken.platformContext.resource.id
//         }
//         const lineItem = await lti.Grade.createLineItem(idtoken, newLineItem)
//         lineItemId = lineItem.id
//       } else lineItemId = lineItems[0].id
//     }

//     // Sending Grade
//     const responseGrade = await lti.Grade.submitScore(idtoken, lineItemId, gradeObj)
//     return res.send(responseGrade)
//   } catch (err) {
//     return res.status(500).send({ err: err.message })
//   }
// })

// 3. Deploy the provider first — this must come before registering platforms!
await lti.deploy({ port: 3000 });