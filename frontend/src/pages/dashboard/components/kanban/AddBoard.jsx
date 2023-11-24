import AddCircle from "@mui/icons-material/AddCircle";
import { CardActions, CardContent, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import { Card } from "antd";
export default function AddBoard ({ setBoardData , boardData }) {
    const [ open , setOpen ] = useState(false)
    const [ name , setName ] = useState('')
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

        setBoardData( 
                [...boardData, { name : name , data: [] , id : boardData.length.toString() }]
        )
       
        handleModalClose()
    }
   
       return(
        <div className="add-board">
            <IconButton onClick={handleAddClick} sx={{color : 'gold' }}>
                <AddCircle sx={{ height : '10vh' , width : '10vh'}}>

                </AddCircle>
            </IconButton>
            <Modal
                onClose={handleModalClose}
                open={open}
            >
                <div className="add-board-modal">
                    <Card>
                        <CardContent>
                            <input value={name} onChange={handleNameChange} placeholder="enter name here"></input>
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