import { useState, useRef, React} from 'react'
import './modal.css'

const Modal = ({setModal, setSelectedImage, selectedImage, generateVariations}) => {
  const [error, setError] = useState(null)
  const ref = useRef(null)

  const closeModal = () => {
    setModal(false)
    setSelectedImage(null)
  }

  const checkSize = () => {
    if(ref.current.width == 256 && ref.current.height == 256){
      generateVariations()
    }else{
      setError('Error: Choose 256 x 256 image')
    }
  }

  return (
    <div className='modal'>
      <div className="modalContainer">
      <h2 className='h2Design'>UPLOADED IMAGE TO BE GENERATED</h2>
        {selectedImage && 
          <img src={URL.createObjectURL(selectedImage)} ref ={ref} alt="uploaded image" />
        }
        <p>{error}</p>
      </div>
      <div className="modalOptionsController">
        <button onClick={checkSize} className='generateBtn'>
          Generate
        </button>
        <div onClick={closeModal}>
          <button className='exitBtn'>Exit</button>
        </div>        
      </div>

    </div>
  )
}

export default Modal