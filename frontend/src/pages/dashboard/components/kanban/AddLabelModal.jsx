import AddCircle from "@mui/icons-material/AddCircle";
import { CardActions, CardContent, IconButton, Modal } from "@mui/material";
import { Card } from "antd";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import TextArea from "./TextArea";
import { BlockPicker } from 'react-color'
import CapsuleButton from "./CapsuleButton";
export default function AddLabelModal({ setBoardMetaData }){
    const [ open , setOpen ] = useState(false)
    const [ name , setName ] = useState('No Name')
    const [ emoji , setEmoji ] = useState('😴')
    const [ description , setDescription ] = useState('')
    const [ color , setColor ] = useState('#FF213F')
    const [ emojiOpen , setEmojiOpen ] = useState(false)
    const [ colorOpen , setColorOpen ] = useState(false)
    const handleAddClick = () => {
        setOpen(true)
    }
    const handleModalClose = () => {
        setOpen(false)
    }
    const handleNameChange = ( e ) => {
        setName(e.target.value)
    }
    const handleNameSubmit = () => {
        //add label here id emoji and name and color description
        
        setBoardMetaData((data)=> ({...data , label : [...data.label , {name : name , description : description , emoji : emoji , id : uuid() , color : color}]}))
        handleModalClose()
    }
    const handleEmojiClick = (e) => {
        console.log(e)
        setEmoji(e.emoji)
        setEmojiOpen(false)
    }
    const handleColorChange = (color) => {
        console.log(color)
        setColor(color.hex)
        setColorOpen(false)
    }
    const handleColorOpen = () => {
        setColorOpen(false)
    }
       return(
        <div>
            <IconButton onClick={handleAddClick} sx={{ color : 'black',fontSize : '16px'}}>
                <AddCircle sx={{color : 'gold' , marginRight : '4px'}}>

                </AddCircle>
                Create Custom Label
            </IconButton>
            <Modal
                onClose={handleModalClose}
                open={open}
                sx={{position : 'absolute' , top : '-25vh'}}
            >
                <div className="add-board-modal">
                    <Card>
                        <CardContent>
                            <input value={name} onChange={handleNameChange} placeholder="enter name here"></input>
                            <div style={{display : 'flex' , flexDirection : 'row', alignItems : 'baseline' }}>
                                <div style={{display : 'flex',flexDirection : 'row',alignItems : 'baseline' , flexGrow : '1'}}>
                                    <CapsuleButton>Emoji</CapsuleButton> {
                                    emojiOpen ? 
                                    <div style={{height : '10px',margin : '4px'}}>
                                        <EmojiPicker 
                                        onEmojiClick={handleEmojiClick} 
                                        height={'50vh'} 
                                        width={'20vw'}
                                        /> 
                                    </div>: 
                                    <div 
                                    onClick={() => {setEmojiOpen(true)}} 
                                    style={{fontSize : '30px'}}>{emoji}
                                    </div>}
                                
                                </div>
                                <div style={{display : 'flex',flexDirection : 'row',alignItems : 'baseline' , flexGrow : '1'}}>
                                    <CapsuleButton>Color</CapsuleButton> {
                                    colorOpen?<BlockPicker 
                                    onChangeComplete={handleColorChange}
                                    color={color}
                                    />:
                                        <div onClick={()=>{setColorOpen(true)}} style={{height : '20px' , width : '20px' , backgroundColor : color , margin:'6px'}}></div>
                                    
                                    }
                                </div>
                            </div>
                           
                            
                            <TextArea 
                            value={description} 
                            setText={setDescription}
                            />   
                        </CardContent>
                        <CardActions>
                            <button onClick={handleNameSubmit}>Create</button>
                        </CardActions>
                    </Card>   
                </div>
                
            </Modal>
        </div>
       )
}