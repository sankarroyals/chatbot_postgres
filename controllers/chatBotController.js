const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

const key = process.env.OPENAI_KEY;
const endpoint = process.env.OPENAI_ENDPOINT;
const client = new OpenAIClient(endpoint, new AzureKeyCredential(key));
const deploymentName = process.env.OPENAI_DEPLOYMENTNAME;

exports.talk = async (req, res) => {
    try {
      const {questions, type} = req.body;
      if(type=='text'){
        const { choices } = await client.getChatCompletions(deploymentName, questions, {maxToken: 2500});
        const completion = choices[0].text;
        questions?.push(choices[0].message);
        return res.status(200).json({message: questions});
       } else if(type=='image'){
        const size = "256x256";
        const n = 3;
        const results = await client.getImages(question, { n, size });
        for (const image of results.data) {
            return res.status(200).json({message: image.url});
        }
       }
     
    } catch (err) {
        res.status(401).json({message: err});
    }
  };

