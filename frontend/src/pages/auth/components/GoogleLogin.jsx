import './auth.css';
import GoogleIcon from '../../../assets/google.svg';

export default function GoogleLogger(){
    const handleGoogleClick = () => {
        window.location.href='http://localhost:8000/auth/google';
    }
    return (
        <div>
            <button onClick={handleGoogleClick} className='google'>
                <img src={GoogleIcon} alt="Google" className='googleimg' />
                Google
            </button>
        </div>
    )
}