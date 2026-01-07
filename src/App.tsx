import { useState } from 'react'
import type { JSX } from "react";
import data from './data.json';
import './App.css'

function App() {
  const extensionData = JSON.stringify(data)
  const extensionDataAsArray = JSON.parse(extensionData)
  const [extensionsForUI, setExtensionsForUI] = useState<ExtensionType[]>(extensionDataAsArray)
  const [filter, setFilter] = useState<string>("All")

  type ExtensionType = {
    id: string,
    logo: string,
    name: string,
    description: string,
    isActive: boolean
  }

  type SwitchProps = {
    isOn: boolean, 
    dataForElement: string,
    handleClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  }
  
  function removeExtension(event:React.MouseEvent<HTMLButtonElement>):void{
    if(event != null){
      const target = event.target as HTMLButtonElement
      const extensionId = target.dataset.extensionId
      const reducedArray = extensionsForUI.filter((extension) => {return extension.id != extensionId})
      setExtensionsForUI(reducedArray)
    }
  }

  function handleFilterControlClick(event:React.MouseEvent<HTMLButtonElement>):void{
    if(event != null){
      const target = event.target as HTMLButtonElement
      const filterValue = target.innerText
      setFilter(filterValue)
    }
  }

  function handleToggle(event: React.ChangeEvent<HTMLInputElement>):void{
    if(event != null){
      const target = event.target as HTMLInputElement
      const extensionId = target.dataset.extensionId

      setExtensionsForUI((prevExtensionsForUI) => { 
        const updatedArray = prevExtensionsForUI.map((extension) => {
          if(extension.id === extensionId){
              const newExtension = {...extension, isActive: !extension.isActive}
              return newExtension
          }else{
            return extension
          }
        })
        return updatedArray
      })
    }
  }

  function extensionUIMaker(array:ExtensionType[]){
    const extensionUI = array.map((extension:ExtensionType):JSX.Element => {
      return(
        <div key={extension.id} className="extension-card">
            <div className="logo-and-extension-content">
              <img src={extension.logo} alt="extension-logo"/>
              <div className="extension-content">
                <h2 className="extension-title">{extension.name}</h2>
                <p className="extension-description">{extension.description}</p>
              </div>
            </div>
            <div className='extension-controls'>
              <button className='extension-removal-CTA' data-extension-id={extension.id} onClick={(e) => removeExtension(e)}>Remove</button>
              <Switch isOn={extension.isActive} dataForElement={extension.id} handleClick={handleToggle}/>
            </div>
        </div>
      )
    })
    return extensionUI
  }
  
  function AllExtensions(){
    const allExtensionUI = extensionUIMaker(extensionsForUI)
    
    return(
      allExtensionUI
    )
  }

  function FilteredExtensions(){
    const extensionFilterToStatus = filter === "Active" ? true : filter === "Inactive" ? false : null 
    const desiredExtensionFinder = extensionsForUI.filter((extension) => {
    return (extension.isActive === extensionFilterToStatus)
  })
    const siftedUI = extensionUIMaker(desiredExtensionFinder)
    
    return(
      siftedUI
    )
  }

  function Switch({isOn, dataForElement, handleClick}:SwitchProps){
    return(
      <>
        <label 
          className='react-switch-label' 
          htmlFor={'react-switch-new'}
        >Active
          <input 
            checked={isOn}
            onChange={(e) => handleClick(e)}
            data-extension-id={dataForElement}
            className="react-switch-checkbox"
            id={'react-switch-new'} 
            type='checkbox'
          />
        </label>
      </>
    )
  }

  return (
    <>
      <header>
        <img alt="company name and logo" src="/public/images/logo.svg"/>
      </header>
      <main>
        <section className="filter-controls-and-header-container">
          <h1>Extensions List</h1>
          <div className="filter-controls-container">
            <button className={`filter-controls  ${filter === "All" ? "active-filter" : ""}` } onClick={(e)=>handleFilterControlClick(e)}>All</button>
            <button className={`filter-controls  ${filter === "Active" ? "active-filter" : ""}` } onClick={(e)=>handleFilterControlClick(e)}>Active</button>
            <button className={`filter-controls  ${filter === "Inactive" ? "active-filter" : ""}` } onClick={(e)=>handleFilterControlClick(e)}>Inactive</button>
          </div>
        </section>
        <section className="extensions-container">{filter === "All" ? <AllExtensions /> : <FilteredExtensions />}</section>
      </main>
    </>
  )
}

export default App
