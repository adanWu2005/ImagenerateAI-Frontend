import React, { useEffect, useState } from 'react';
import "./App.css";
import "./Components/image.css";
import "./Components/button.css";
import supriseOptions from "./Components/supriseOptions"
import Loader from './Components/loader';
import Modal from './Components/Modal';
import AppLoader from './Components/appLoader';

const App = () => {
  const [images, setImages] = useState([]);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(null);
  const [appLoading, setAppLoading] = useState(true)
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null)
  const [modal, setModal] = useState(null)

  useEffect(()=>{
    setAppLoading(true)
    setTimeout(()=>{
      setAppLoading(false)
    },3000)
  }, [])

  const supriseImages = () => {
      const random = supriseOptions[Math.floor(Math.random()*supriseOptions.length)]
      setValue(random)
  }

  const uploadImage = async (e) =>{
    console.log(e.target.files[0])
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    setModal(true)
    setSelectedImage(e.target.files[0])
    e.target.value = null

    const options = {
      method: "POST",
      body: formData
    };
    const response = await fetch('http://localhost:3001/upload', options);
    const data = await response.json()
    console.log(data)
  }

  const getImages = async () => { 
    try {
        setLoading(true)
        setImages([])
        setError(null);
        
        if (value === ''){
          setError('AI image input cannot be empty')
          setLoading(false)
          return;
        }
        const options = {
            method: "POST",
            body: JSON.stringify({
                message: value 
            }),
            headers: {
                "Content-type": "application/json"
            }
        };
        const response = await fetch('http://localhost:3001/images', options);
        const data = await response.json();
        console.log("Received data:", data);
        if (Array.isArray(data)) {
            setImages(data); 
        } else {
            console.error("Unexpected data format:", data);
            setError('Unexpected data format.');
        }
    } catch (err) {
        console.log(`Error: ${err}`);
        setError('Error generating image.');
    } finally {
        setLoading(false)
    }
   };

   const generateVariations = async () => {
    setError(null);
    setModal(false);
    setLoading(true);
    setValue('')
    setImages([]);
    if (selectedImage === null) {
      setError('Must select an image');
      setModal(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);
      const options = {
        method: 'POST',
        body: formData
      };
      const response = await fetch('http://localhost:3001/variations', options);
  
      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);
  
      const data = await response.json();
      setImages(data); 
      setError(null);
    } catch (err) {
      console.log(`Error: ${err}`);
      setError('Error generating variations.');
    } finally {
      setLoading(false);
    }
  };
  return (
  <>
    {appLoading ? (
      <div className="appLoadContainer">
        <AppLoader/>
      </div>
    ) : (
      <div className='appContainer'>
        <div className="app">
          <div className="imgContainer">
            <div>
              <div className="inputContainer">
                <input 
                  className='imgInput' 
                  placeholder='Enter prompt' 
                  value={value}
                  onChange={e => setValue(e.target.value)} 
                />
                <label className='inputLabel'>Your AI generated image...</label>
              </div>
            </div>
            <div className="btnContainer">
              <button className="generateBtn" onClick={getImages}>Generate</button>
              <button className="supriseBtn" onClick={supriseImages}>Surprise me</button>
              <button className="uploadBtn">
                <label htmlFor="files">Upload Image</label>    
                <input onChange={uploadImage} id='files' accept='image/*' type='file' hidden/>  
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {modal && (
      <div className="overlay">
        <Modal 
          setModal={setModal}  
          setSelectedImage={setSelectedImage}
          selectedImage={selectedImage}
          generateVariations={generateVariations}
        />
      </div>
    )}

    {error ? (
      <div className="emptyContainer">
        <p>{error}</p> 
      </div>
    ) : loading ? (
      <div className="loaderContainer">
        <Loader />
      </div>
    ) : (
      <div className="imgSectionContainer">
        <section className="imgSection">
          {images.map((image, index) => (
            <img key={index} src={image.url} alt={`Generated image ${index + 1}`} />
          ))}
        </section>
      </div>
    )}
  </>
  );
};

export default App;
