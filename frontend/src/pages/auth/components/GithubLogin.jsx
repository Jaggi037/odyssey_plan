import './auth.css';
import GithubIcon from '../../../assets/github.svg'

import { backendURL } from "../../../global/request"
export default function GithubLogger(){
    const handleGithubClick = () => {
        window.location.href = backendURL+'/auth/github';
    }
    return (
        <button onClick={handleGithubClick} className='github-btn'>
            <img src={GithubIcon} alt="Github" className='github-img' />
            <span className='github-text'>GitHub</span>
        </button>
    )
}