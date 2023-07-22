import React, { useState } from 'react';


const Diagnostic = (symptoms) => {


  const [answer, setAnswer] = useState(null);
  
  async function runPrompt() {
    const prompt = `I am not feeling very well. My symptoms are ${symptoms}. Can you provide 1-3 possible conditions as well as 1-3 medications for me to consider to address my concerns? Please provide specific medication names (i.e. Asprin, Aleve-D, Flonase, etc...)`;

    const apiKey = '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' // For security reasons, OpenAI deactivates your api key if it detects it on Github, so we've removed ours since it will decativate before you read this
    const apiUrl = 'https://api.openai.com/v1/engines/text-davinci-003/completions';

    // Refer to OpenAI's docs regarding what temperature does. The higher the number, the whackier it gets.
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt,
        max_tokens: 2048,
        temperature: .1
      })
    };

    try {
      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();
      console.log(data.choices[0].text);
      let sentence = data.choices[0].text;
      console.log(data)
      formatAnswer(sentence);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // A desparate man's attempt at string manipulation that doesn't seem to work right
  const formatAnswer = (answer) => {
    // let sentenceArr = answer.split(/(\n\n)/);
    // console.log(sentenceArr);
    // let sentence = (sentenceArr).toString().replaceAll(',','\n');
    answer.split('\n\n').join('\n')
    setAnswer(answer);
  }

  return (
    <div className="diagnostic-container" style={{ marginTop: "20px", maxWidth: "650px", margin: "0 auto", lineHeight: "2rem", height: "88vh", overflow: "hidden" }}>
      <h3 className="dse-title" style={{margin: "60px 0"}}>Diagnostic Suggestion Engine</h3>
      <p className="dse-para" style={{ textAlign: "center" }}>
        To use the Diagnostic Suggestion Engine, please describe your symptoms below. The DSE will then determine 1-3 possible ailments that you may be suffering from, as well as 1-3 medications for you to consider taking in order to best address your concerns.
      </p>
      <p className="dse-para" style={{ textAlign: "center" }}>
        It's best to consult with a healthcare professional or registered dietitian who can provide personalized recommendations based on your individual needs and health status.
      </p>
      <br></br>
      <div className="dse-form-container" >
        <form className="form-input" onSubmit={e => {
          e.preventDefault();
          runPrompt();
        }}>
          <input type="text" placeholder='Symptoms'></input>
          <input type="submit"></input>
        </form>
      </div>

        <div className="gpt-response-container" style={{marginTop: "0", marginBottom: "50px"}}>
        <div className="gpt-response">{answer && <h4>Disagnostic Search Engine Response:</h4>}</div>
          <p className="gpt-response">{answer && answer}</p>
        </div>

    </div>
  );
  
};

export default Diagnostic;
