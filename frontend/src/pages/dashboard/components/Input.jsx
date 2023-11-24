import './css/Input.css'
export default function Input ( {placeholder , setInput = () => {} , value} ) {

    const handleChange = (e) => {
        setInput(e.target.value)
    }
    return (
        <div className="container">
            <input type="text" className="normal-text-input" placeholder={ placeholder } onChange={ handleChange } value={ value }/>
        </div>
    )
}