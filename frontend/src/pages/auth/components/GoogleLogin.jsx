import './auth.css';
import GoogleIcon from '../../../assets/google.svg';

export default function GoogleLogger(){
    const handleGoogleClick = () => {
        window.location.href='http://localhost:8000/auth/google';
    }
    return (
        <div>
            <button onClick={handleGoogleClick} className='google-btn'>
                <img src={GoogleIcon} alt="Google" className='google-img' />
                <span className='google-text'>Google</span>
            </button>
        </div>
    )
}