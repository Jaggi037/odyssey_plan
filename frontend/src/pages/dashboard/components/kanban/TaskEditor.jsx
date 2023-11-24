import CapsuleButton from "./CapsuleButton"
import { Card , CardActions ,CardHeader , CardContent , IconButton  , ButtonGroup, MenuItem } from '@mui/material'
import TextArea from './TextArea'
import Input  from "../Input";
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FlagIcon from '@mui/icons-material/Flag';
import SupportIcon from '@mui/icons-material/Support';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import DropdownMenu from "./DropdownMenu";
import Calendar from './CalanderStyled'
import { useEffect, useState } from "react";
import LabelIcon from '@mui/icons-material/Label';
import AddLabelModal from "./AddLabelModal";
import { v4 as uuid } from "uuid";
//done for modularity
const priorityData = ['procrastinate' , 'low' , 'medium' , 'high']; //array of priority
const kanbanData = ['Backlog' , 'Doing' , 'Review' , 'Done']; // array of kanban 
const colors = [ 'red' , 'yellow' , 'blue' , 'green' , 'purple' , 'pink']; //array of colors


export default function TaskEditor({ setTaskEditorActive,setBoardData, boardData, setIdTrack, idTrack , setBoardMetaData , boardMetaData , handleEditTask ,taskEditorData , setTaskEditorData , kanbanIndex = 0}){
  const [ date , setDate ] = useState(taskEditorData?taskEditorData.data:null);
  const [ priority , setPriority ] = useState(taskEditorData?taskEditorData.priorityData:0);
  const [ kanban , setKanban ] = useState(kanbanIndex);
  const [ title , setTitle ] = useState(taskEditorData?taskEditorData.name:'');
  const [text , setText ] = useState(taskEditorData?taskEditorData.description:'');
  const [ label , setLabel ] = useState(taskEditorData?taskEditorData.label:[]);
  const [anchorCal, setAnchorCal] = useState(null);
  const [anchorFlag , setAnchorFlag] = useState(null);
  const [anchorKanban , setAnchorKanban] = useState(null);
  const [ anchorLabel , setAnchorLabel ] = useState(null)
    useEffect(()=> {
        return (
            ()=> {
                console.log('editor has been dismounted')
            }
        )
    }
    ,[])
    useEffect(
        () => {
            //set all the data here
        }
        , [taskEditorData]
    )
  const handleMenuItemClick = ( stateSetter , anchorSetter , index ) => {
    stateSetter(index);
    anchorSetter(null);
  }
  const handleCreateClick = () => {
    if(taskEditorData == null){
        boardData[kanban].data = [...boardData[kanban].data , { 
            id : uuid() ,
            name : title ,
            description : text,
            date : date,
            priority : priorityData[priority],
            priorityIndex : priority,
            label : label
            //insert labels here
        }]
    }
    else{
        let elementIndex = 0 
        let boardIndex = 0;
        for( let i = 0 ; i < boardData.length ; i++ ){
            for( let j = 0 ; j < boardData[i].data.length ; j++){
                if(boardData[i].data[j].id == taskEditorData.id){
                    boardIndex = i
                    elementIndex = j
                }
            }
        }
        boardData[boardIndex].data[elementIndex] = { 
            id : taskEditorData.id ,
            name : title ,
            description : text,
            date : date,
            priority : priorityData[priority],
            priorityIndex : priority,
            boardIndex : kanban ,
            label : label
        }
    }
    
    setBoardData([...boardData])
    setDate()
    setPriority(0)
    setKanban(0)
    setTitle('')
    setText('')
    setLabel([])
    setIdTrack(idTrack + 1)
  }
  const handleClose = () => {
    setTaskEditorActive(false)
    setTaskEditorData(null)
  }
  const handleLabelClick = ( labelData ) => {
    for ( let i = 0 ; i < label.length ; i++ ){
        if( label[i].id == labelData.id ){
            return;            
        }
    } 
    
    setLabel((label) => ([ ...label , labelData ]))
    
  }
  return (
    
        <Card  sx={{height:'45vh', width: '30vw' , position : 'absolute' , left : '0' , top : '0'}}>
            <CardHeader
                subheader={<Input placeholder={'Type Here'} setInput={setTitle} value={title}></Input>}
                action = {<IconButton onClick={handleClose}><CloseIcon></CloseIcon></IconButton>}
            />
            <CardContent>
                {/* <div className="text-editor-title">
                    In    <div style={{display:'inline' , margin:'0 10%'}}><CapsuleButton> Something</CapsuleButton> </div>       For    <div style={{display:'inline' , marginLeft:'10%'}}><CapsuleButton> Something</CapsuleButton> </div>
                </div> */}
                <div>
                    {label.map((item , index)=>(<span key={index}>{item.emoji}</span>))}
                </div>
                <div>
                    <TextArea setText={setText} value={text}></TextArea>
                </div>
            </CardContent>
            <CardActions>
                <ButtonGroup>
                    <DropdownMenu icon={<CalendarMonthIcon style={{color : 'green'}}/>} popUp={true} anchorEl={anchorCal} setAnchorEl={setAnchorCal}>
                        <MenuItem>
                           {/* <Calendar date={date} setDate={(e) => {
                            setDate(e==null?null:e)
                            setAnchorCal(null);
                           }}/> */}
                           {
                             'work under progress'
                           }
                        </MenuItem>
                    </DropdownMenu>
                    <DropdownMenu icon={<FlagIcon style={{color : 'purple'}}/>} popUp={true} anchorEl={anchorFlag} setAnchorEl={setAnchorFlag}>
                        {
                           priorityData.map(( data , index ) => {
                                return (
                                    <MenuItem key={`p${index}`} onClick={()=>{
                                        handleMenuItemClick(setPriority,setAnchorFlag,index)
                                    }}>
                                        <FlagIcon  style={{color : colors[index]}}/>
                                        {data}
                                    </MenuItem>
                                )
                            })
                        }
                                  
                    </DropdownMenu>
                    <DropdownMenu icon={<SupportIcon style={{color : 'red'}}/>} popUp={true} anchorEl={anchorLabel} setAnchorEl={setAnchorLabel}>
                        {
                            boardData.map(( data , index ) => {
                                return (
                                    <MenuItem key={`k${index}`} onClick = { () => {handleMenuItemClick(setKanban,setAnchorKanban,index)}}>
                                        <FlagIcon  style={{color : colors[index]}}/>
                                        {data.name}
                                    </MenuItem>
                                )
                            })
                           
                        }
                                 
                    </DropdownMenu>
                    <DropdownMenu icon={<LabelIcon style={{color : 'lightcoral'}}></LabelIcon>} popUp={true} anchorEl={anchorKanban} setAnchorEl={setAnchorKanban}>
                        {
                            boardMetaData.label.map((data , index) => {
                                return(
                                    <MenuItem key={`m${index}`} onClick={()=>{handleLabelClick(data)}}>
                                        {data.emoji}
                                        {data.name}
                                    </MenuItem>
                                )
                            })
                        }
                        <MenuItem>
                            <AddLabelModal setBoardMetaData={setBoardMetaData}/>
                        </MenuItem>
                    </DropdownMenu>
                </ButtonGroup>
                <IconButton sx={{position : 'absolute' , right : '2vw' ,color : 'gold'}} onClick={ ()=> {
                    handleClose()
                    handleCreateClick();
                    
                }}>
                    <AddCircleIcon ></AddCircleIcon>
                </IconButton>
            </CardActions>
        </Card>
   
    
  );
}



