import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import logo from './logo.png';

function DogApp() {
  const [dogData, setDogData] = useState(null);
  const [gpt3Text, setGpt3Text] = useState('');

  const getRandomDog = async () => {
    try {
      const breedsResponse = await axios.get('https://api.thedogapi.com/v1/breeds', {
        headers: {
          'x-api-key': process.env.REACT_APP_DOG_API_KEY
        }
      });

      const randomBreed = breedsResponse.data[Math.floor(Math.random() * breedsResponse.data.length)];

      const dogResponse = await axios.get(`https://api.thedogapi.com/v1/images/search?breed_id=${randomBreed.id}`, {
        headers: {
          'x-api-key': process.env.REACT_APP_DOG_API_KEY
        }
      });

      const dogData = dogResponse.data[0];
      setDogData(dogData);

      const prompt = `Write me a story about a girl named Avery playing with this cute, cuddly dog. The dog's breed is: ${dogData.breeds[0].name}. Pick a name for the dog using the breed info as inspiration. A second grader should be able to read the text returned. The story should contain something about how Avery played with the dog doing something that dogs love to do. The story should end with a tip for Avery about how to be a great dog trainer and a great girl.`;

      const gpt3Response = await axios.post('https://api.openai.com/v1/engines/text-davinci-002/completions', {
        'prompt': prompt,
        'max_tokens': 2000
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        }
      });

      setGpt3Text(gpt3Response.data.choices[0].text);

    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div className="container">
  <nav className="navbar navbar-light bg-light">
    <a className="navbar-brand" href="/">
      <img src={logo} alt="WeLoveDogs.ai" style={{ width: '100px' }} />
    </a>
  </nav>

  <div className="row mt-5">
    <div className="col text-center">
      <button className="btn btn-primary mb-5" onClick={getRandomDog}>
        Show Me a New Dog 🐶
      </button>
    </div>
  </div>
  
  {dogData && (
    <div className="row mt-5" id="dog-data">
      <div className="col text-center">
        <img src={dogData.url} width="300" alt="Dog" />
      </div>
      <div className="col">
        <h3>😍 Hooray! Let's read about an: {dogData.breeds[0].name}</h3>
        <p>💕 An <b>{dogData.breeds[0].name} </b>is {dogData.breeds[0].temperament}</p>
        <pre style={{whiteSpace: "pre-wrap"}}>
          {gpt3Text}
        </pre>
      </div>
    </div>
  )}
</div>


  );
}

export default DogApp;
