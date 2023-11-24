import MoreHoriz from "@mui/icons-material/MoreHoriz"
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { CardContent, IconButton, Modal , Card } from "@mui/material"
import { useState } from "react"
import AddIcon from '@mui/icons-material/Add';
import { backendURL, send } from "../../../../global/request";
import EmojiPicker from "emoji-picker-react";
import { v4 as uuid } from "uuid";

export default function TeamspaceModal({setWorkSpacesIdArray }){
    const [ open , setOpen ] = useState(false)
    const [ name , setName ] = useState('')
    const [ emojiOpen , setEmojiOpen ] = useState(false)

    const [ emoji , setEmoji ] = useState('📑')

    const [ workspaceCode , setWorkspaceCode ] = useState('')
    const handleModalClose = () => {
        setOpen(false)
        setName('')
        setEmojiOpen(false)

        setEmoji('📑')

        setWorkspaceCode(false)
    }
    const handleModalOpen = () => {
        setOpen(true)
    }
    const handleChangeName = (e) => {
        setName(e.target.value)
    }
    const handleSubmit = async () => {
        console.log('here')
        const res = await send.post(backendURL + '/data/createWorkspace' , {
            data : {
                accessType : 'public',
                name : name,
                icon : emoji,
                workspaceId : uuid(),
            }
        })
        console.log(res)
        if( res.status == 200 ){
            setWorkSpacesIdArray((idArray) => ([...idArray , res.data.workspaceId]))
        }
        setOpen(false)
    }
    const handleEmojiClick = (e) => {
        setEmojiOpen(false)
        setEmoji(e.emoji)
    }
    const handleSubmitByCode = async () => {
        try{
            const res = await send.post( backendURL + '/data/addWorkspace' , {
                data : {
                    workspaceId : workspaceCode 
                }
            } )
            console.log(res)
            if(res.status == 200){
                setWorkSpacesIdArray((data) => ([...data , workspaceCode]))
                handleModalClose()  
            }
        }
        catch(e){
            console.log(e)
        }
       
    }   
    const handleCodeChange = (e) => {
        setWorkspaceCode(e.target.value)
    }
    return(
        <>

            <IconButton onClick={handleModalOpen} >
                <AddIcon style={{color : '#164863'}}/>

            </IconButton>
            <Modal
            open={open}
            onClose={handleModalClose}
            sx={{width : '40vw' , height: '30vh' , position : 'fixed' , top : '30vh' , margin : '0 auto'}}
            >

                <Card sx={{width : '40vw' , height : '40vh'}}>

                    <CardContent sx={{display : 'flex' , flexDirection : 'column' , alignItems : 'center' , gap:'3vh'}}>
                        <div>
                            Icon : 
                        {emojiOpen?<EmojiPicker onEmojiClick={handleEmojiClick}></EmojiPicker>:<IconButton onClick={()=>{setEmojiOpen(true)}}>{emoji}</IconButton>}
                        </div>
                        
                        <input type="text" value={name} onChange={handleChangeName} placeholder="enter name" style={{width : '100%' , placeContent : 'center'}}></input>
                        <button onClick={handleSubmit}>Submit</button>
                    </CardContent>
                    <CardContent>
                        <input type="text" value={workspaceCode} onChange={handleCodeChange} placeholder="enter the code"></input>
                        <br></br>
                        <button onClick={handleSubmitByCode}>Submit with particular Code</button>
                    </CardContent>
                </Card>
                
            </Modal>
        </>
        
    )
}