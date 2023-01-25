import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = "Break down this topic into 5 key steps. These 5 steps should be the main areas of knowledge required to understand the topic at a deep level. Topic: ";

const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.7,
    max_tokens: 800,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  const secondPrompt = `Take the steps below and explain each step as if you were teaching an 8 year old student. Make your explanation a story and make it entertaining. Elaborate on each step, do not just list them out. Explain why. Steps: 
  
  Steps: ${basePromptOutput.text}`

  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.7,
		// I also increase max_tokens.
    max_tokens: 800,
  });
  
  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  // Send over the Prompt #2's output to our UI instead of Prompt #1's.
  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;
