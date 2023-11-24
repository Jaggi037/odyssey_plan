import '../css/TextArea.css'
export default function TextArea ({setText , value}) {
    const handleChange = (e) => {
        setText(e.target.value)
    }
    return (
        <div className="container">
             <textarea className="big-text-area" placeholder="Enter your text here..." onChange={handleChange} value={value}></textarea>
        </div>
    )
}