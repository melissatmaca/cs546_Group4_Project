//imports
import OpenAI from "openai";

//query chatgpt section
const openai = new OpenAI({
    apiKey: process.env.openAIKey
});

async function chatGPTQuery(role,query){
    const completion = await openai.chat.completions.create({
        messages: [{role: role, content: query}],
        model: "gpt-4-turbo",
        response_format: {type: "json_object"}
    }); 
    try{
    return completion.choices[0].message.content;
    } catch (e) {
        console.error("Could not query OpenAI. Error: ", e);
        throw e; 
    }
    
}


//spotify section