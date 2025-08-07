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

// 3. Add custom routes BEFORE deployment
lti.app.post('/grade', lti.middleware , async (req, res) => {
  try {
    console.log('🔹 Grade route hit');
    console.log('🔹 Request body:', req.body);
    
    const idtoken = res.locals.token // IdToken provided by ltijs middleware
    const score = req.body.grade // User numeric score sent in the body
    
    console.log('🔹 Incoming score:', score);
    console.log('🔹 idtoken.user:', idtoken?.user);
    
    if (!idtoken) {
      console.log('❌ No token in res.locals');
      return res.status(400).send({ error: 'Invalid LTI session' });
    }
    
    if (score === undefined || score === null) {
      console.log('❌ No score provided');
      return res.status(400).send({ error: 'Grade is required' });
    }
    
    // Creating Grade object
    const gradeObj = {
      userId: idtoken.user,
      scoreGiven: score,
      scoreMaximum: 100,
      activityProgress: 'Completed',
      gradingProgress: 'FullyGraded'
    }

    // Selecting linetItem ID
    let lineItemId = idtoken.platformContext.endpoint.lineitem // Attempting to retrieve it from idtoken
    if (!lineItemId) {
      console.log('🔹 No existing lineitem, fetching or creating...');
      const response = await lti.Grade.getLineItems(idtoken, { resourceLinkId: true })
      const lineItems = response.lineItems
      if (lineItems.length === 0) {
        // Creating line item if there is none
        console.log('🔹 Creating new line item')
        const newLineItem = {
          scoreMaximum: 100,
          label: 'Grade',
          tag: 'grade',
          resourceLinkId: idtoken.platformContext.resource.id
        }
        const lineItem = await lti.Grade.createLineItem(idtoken, newLineItem)
        lineItemId = lineItem.id
        console.log('🔹 Created new lineitem with ID:', lineItemId);
      } else {
        lineItemId = lineItems[0].id
        console.log('🔹 Using existing lineitem with ID:', lineItemId);
      }
    } else {
      console.log('🔹 Using lineitem from token:', lineItemId);
    }

    // Sending Grade
    console.log('🔹 Submitting score...');
    const responseGrade = await lti.Grade.submitScore(idtoken, lineItemId, gradeObj)
    console.log('🔹 Grade submitted successfully:', responseGrade);
    return res.send(responseGrade)
  } catch (err) {
    console.error('❌ Error in /grade route:', err);
    return res.status(500).send({ err: err.message })
  }
})

// 4. Deploy the provider AFTER defining routes
await lti.deploy({ port: 3000 });
