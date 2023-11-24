import { useState } from "react"

export default function RenamableName ( { id , setFiles  , name , sendData  , workspaceId }) {
    const [ text , setText ] = useState(name)
    const [ editable , setEditable ] = useState(true)
    const handleDoubleClick = () => {
        setEditable(!editable)
    }
    const loop = ( data , key ) => {
       
        data.forEach((item) => {
            console.log(item.key , key)
          
            if (item.key == key) {
                console.log('name chhange to ' + text)
              item.name = text;
            }
            if (item.children) {
              loop(item.children , key);
            }
        }
        )
    }
   
    const handleKeyDown = (e) => {
        if(e.code == 'Enter'){
            //update the setdata here
            
            setFiles((gData) => {
             
                    loop( gData , id )
                    if(sendData != null){
                        sendData(gData , workspaceId)
                        console.log(gData)
                    }
                    
                    return [...gData]
            })

            setEditable(true)
        }
    }
    
    const handleChange = (e) => { 

        setText(e.target.value)
    }

    return (
        editable?  (<span 
                    onDoubleClick={handleDoubleClick}
                    className="node-title-holder"
                    >
                        {text}
                    </span>
                    ):
                    (
                        <input 
                        type="text" 
                        value={text} 
                        onChange={handleChange} 
                        autoFocus 
                        onKeyDown={handleKeyDown} 
                        placeholder="enter name"
                        className="node-title-holder"
                        >

                        </input>
                    )    
    )
}