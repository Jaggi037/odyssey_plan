import {send,frontendURL,backendURL} from '../../../global/request'
import { useState } from 'react';
import GoogleLogger from "./GoogleLogin"
import GithubLogger from "./GithubLogin"
import Icon from '../../../assets/icon_dark.png'
import './auth.css';

export default function LocalLogger(){
    const [register,setRegister] = useState(true);
    const handleClick = () => {
        setRegister(!register);
    }
    return(
    <>
        <div className='register-button'>
        {register==true?<LocalLoging handleClick={handleClick}/>:<LocalRegister handleClick={handleClick}/>}
        </div>
    </>
    )
}
export function LocalRegister({handleClick}){
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [email,setEmail] = useState('');
    const [verificationSent,setVerificationSent] = useState(false);
    const [verificationMessage,setVerificationMessage] = useState('');
    const handleSubmit = async(e) => {
        e.preventDefault();
        const formData =  {
            username : username ,
            email : email ,
            password : password ,
        }
        const res = await send.post(backendURL+'/auth/register',{
            data : formData
        })
        if(res.status==200){
            setVerificationSent(true);
            setVerificationMessage(res.data);
        }
        else{
            setVerificationSent(true);
            setVerificationMessage(res.data);
        }
       
        setEmail('');
        setPassword('');
        setUsername('');
    }
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    }
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }
    return (
        //Register Page start

        <div className='auth-div'>
            <div className='login-inner'>

            <img src={Icon} alt="Icon" className='icon' />
            <h1 className="heading">
                Create an account
            </h1>

                    <form className="login-form" action="/from" method="post" >
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" required onChange={handleUsernameChange} value={username} placeholder='Enter your username'/>
                        
                        
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required onChange={handleEmailChange} value={email} placeholder='Enter your email'/>

                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" required onChange={handlePasswordChange} value={password} placeholder='********'/>
                        
                            {verificationSent&&<div className="error">{verificationMessage}</div>}
                        
                        
                        <input type="submit" value="Sign Up" onClick={handleSubmit}/>
                    </form>
                    <GoogleLogger></GoogleLogger>
                    <GithubLogger></GithubLogger>
                    <div className='msgContainer'>
                        <button onClick={handleClick} className='msgButton'>Already have an account?</button>
                    </div>
                </div>
        </div>
    )
}

export function LocalLoging({handleClick}){
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [data,setData] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault();
        const formData =  {
            username : username ,
            password : password ,
        }
        const res = await send.get(backendURL + '/auth/local',{
            params : formData , 
        })  
       
        if(res.status==200){
            window.location.href = frontendURL
        }
        else{
            setData(res.data);
        }
    }
   
    const handleUsernameChange = (e) => {
        setData('')
        setUsername(e.target.value);
    }
    const handlePasswordChange = (e) => {
        setData('')
        setPassword(e.target.value);
    }
    return (
        <div className='auth-div'>
            
            <div className='inner-login-page'>
            <img src={Icon} alt="Icon" className='icon' />
            <h1 className="heading">
                Welcome back!
            </h1>
            <form action={backendURL+'/auth/local'} method="get" className="login-form">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" required onChange={handleUsernameChange} value={username} placeholder='Enter your username'/>
    
                
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required onChange={handlePasswordChange} value={password} placeholder='********'/>
                

                <div className="error">
                    {data}
                </div>

                <input type="submit" value="Sign In" onClick={handleSubmit}/>
            </form>
            <GoogleLogger></GoogleLogger>
            <GithubLogger></GithubLogger>
            <div className='msgContainer'>
                <p>Need an account?</p>
                <button onClick={handleClick} className='msgButton'>Sign In</button>
            </div>
            </div>
        </div>

    )
}