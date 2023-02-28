
import type { AppProps } from 'next/app'
import { useState, useEffect, ChangeEvent } from 'react'
import "./App.css"
import {Configuration,OpenAIApi} from 'openai'
import getConfig from 'next/config'

export default function App({ Component, pageProps }: AppProps) {
 // const [imgURL, setImgURL] = useState('/robot-painting_svg.svg')
  const [result, setResult] = useState('https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png')
  const [prompt, setPrompt] =useState("")
  //const [imageTitel, setImageTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [typedText, setTypedText] = useState('')

  const text = 'AI is Generating your image...'

  const {publicRuntimeConfig} =getConfig()
  const apiKey= (typeof publicRuntimeConfig !=='undefined' && publicRuntimeConfig.apiKey)
                ? publicRuntimeConfig.apiKey              // if typeof is true
                : process.env.API_KEY                     // if typeof is false
  if(!apiKey){
    throw new Error('api Key is not defined in the config file')
  }
   console.log(apiKey)

  const configuration= new Configuration({apiKey})
  const openai = new OpenAIApi(configuration)

  const generateImage = async () => {
    setLoading(true)
    const res = await openai.createImage ({
      prompt: prompt,
      n : 1,
      size : "512x512"
    })
    setLoading(false)
   // const image_url = res['data'][0]['url']
    const ImgOutput= res.data
    setResult(ImgOutput.data[0].url || 'No Img was Found')
    console.log(ImgOutput)
  }


  useEffect(()=>{
    if(loading){
      let i=0
      const typing=setInterval(()=>{
        setTypedText(text.slice(0,i))
        i++
        if(i>text.length+3){
          i=0
          setTypedText('')
        }
      },100)
      return() => clearInterval(typing)
    }

  },[loading])
  

  const sendEmail= (url="")=>{
    url= result
    const message =`Here is your AI generated Image Link from  Vishw AI image generator: ${url}`
    window.location.href= `mailto:someone@example.com ?subject= Image Download Link- Vishw AI Image Generator &body=${message}` 
  }
 
  return <div className="app-main">
    <h2>  VISHW   </h2>
    <h3> AI Image Generator </h3>

    <textarea
      className="app-input"
      placeholder="Provide the description of the image you want to generate throught AI"
      onChange={(e) => setPrompt(e.target.value)}
    />
    <button onClick={generateImage}>Generate Image</button><br></br>
    <>
    { loading ? (
      <>
      <h3>{typedText}</h3>
      <div className='lds-ripple'>
        <div></div>
        <div></div>
      </div>
      </>
    )
    :  <img src={result} onClick={()=> sendEmail(result)} style={{cursor: 'pointer'}} className="result-image" alt="result"/>
    }
      </>
  </div>
}
