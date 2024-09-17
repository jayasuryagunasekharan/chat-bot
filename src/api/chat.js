   // src/api/chat.js
   const axios = require('axios');

   // Handler function for the serverless function
   module.exports = async (req, res) => {
     if (req.method !== 'POST') {
       return res.status(405).json({ error: 'Method not allowed' });
     }

     const { message } = req.body;

     if (!message) {
       return res.status(400).json({ error: 'No message provided.' });
     }

     try {
       const response = await axios.post(
         `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
         {
           contents: [
             {
               parts: [
                 {
                   text: message,
                 },
               ],
             },
           ],
         },
         {
           headers: {
             'Content-Type': 'application/json',
           },
         }
       );

       const reply = response.data.candidates[0].content.parts[0].text;
       res.status(200).json({ reply });
     } catch (error) {
       console.error('Error communicating with Gemini Pro API:', error.response ? error.response.data : error.message);
       res.status(500).json({ error: 'Failed to process your request.' });
     }
   };