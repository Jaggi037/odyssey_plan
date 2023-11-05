import { BrowserRouter, Routes, Route } from "react-router-dom";


import DashBoard from "./pages/dashboard/dashboard";
import Auth from "./pages/auth/auth";


import { send } from './global/request'
import { useState , useEffect } from "react";

import DocumentEditor from './pages/document/document'
import Redirect from "./pages/document/component/redirect";

function App() {
  
  const [user,setUser]=useState(null);
  const [authenticated,setAuthenticated]=useState(null);
  
  useEffect(()=>{
      send.get('http://localhost:8000/auth/status'
          )
    .then((response) => {
      setAuthenticated(response.data);
      console.log(response.data);
    })    //effect to change the status of app.js
    .catch((err) => {
      console.log(err.message);
    });
  },[])


  useEffect(()=>{
      if(authenticated==false){
          setUser(null); ///if not authenticated set user as false
      }
      if(authenticated==true){
          send.get('http://localhost:8000/user').then((res)=>{
               //if authenticated get the user detail's and true
              setUser(res.data);
          }).catch((err)=>{
              console.log(err.message);
          })
      }
  },[authenticated])

  if(user==null&&authenticated==true){
      send.get('http://localhost:8000/user').then((res)=>{
               //if authenticated get the user detail's and true
              setUser(res.data);
          }).catch((err)=>{
              console.log(err.message);
          })
  }
  if(authenticated==null){
    //remove this in production
      return (
      <div>
          LOADER MOST PROBABLY BACKEND IS DOWN   
      </div>)
  }
  console.log(authenticated)
  if(authenticated==true){
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashBoard></DashBoard>}/>
            <Route path='/documents' exact element={<Redirect></Redirect>}/>  
            <Route path='/documents/:id' exact element={<DocumentEditor></DocumentEditor>} /> 
          </Routes>
        </BrowserRouter>
      </>
    )
  }
  else{
    return (
      <>
        THIB akpspdmas
        <Auth></Auth>
      </>
    )
    
  }
  
}

export default App
