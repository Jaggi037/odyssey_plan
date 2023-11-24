import { useEffect, useState } from "react";

import { Tree } from 'antd';

import "rc-tree/assets/index.css"
import '../css/Sidebar.css'

import { IconButton, MenuItem, Typography } from "@mui/material";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import PostAddIcon from '@mui/icons-material/PostAdd';
import RenamableName from "./Renamable";

import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';

import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import { backendURL, frontendURL, send } from "../../../../global/request";
import { v4 as uuid} from "uuid";
import CapsuleButton from "../kanban/CapsuleButton";
import Icon from "./IconProvider";
import Search from "antd/es/input/Search";
import { parse, stringify } from "flatted";
import DropdownMenu from "../kanban/DropdownMenu";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const { TreeNode } = Tree;



export default function RecursiveSidebarMultiple({ 
      setContent , 
      workSpaceId,
      socket ,

}){
    const [ currpos , setCurrpos ] = useState('0');
    const [ keyTracker , setKeyTracker ] = useState(100);
    const [ disabled , setDisabled ] = useState(true)
    const [ text , setText ] = useState('')
    const [ expandedKeys , setExpandedKeys ] = useState([])
    const [ name , setName ] = useState('')
    const [ files , setFiles ] = useState([])
    const [ anchor , setAnchor ] = useState(null)
    const [ icon , setIcon ] = useState('')
    const [ close , setClose ] = useState(false)
    console.log(files)
    const sendData = async ( personalSpace , workSpaceId) => {
        try{
          const recur = ( data ) => {
              if(data == null){
                  return
              }
              data.forEach(
                  ( item ) => {
                      item.title = ""
                      recur(data.children)
                  }
              )
          }
          recur(personalSpace)

          const payload = stringify(personalSpace)
          const res =  await send.post(backendURL + '/data/saveFolder' , {
              data : {
                  workspaceId : workSpaceId,
                  content : payload
              }    
          })
          if(res.status == 200){
            socket.emit('change-folderstructure' , workSpaceId)
            
          }
        
        }
        catch(e){
          console.log(e)
        }   
        }
  useEffect(() => {
    const getData = async (workSpaceId) => {
        const res = await   send.get(backendURL + '/data/getFolder' , {
            params : {
                workspaceId : workSpaceId
            }
        })
        
        if(res.status == 200){
          console.log(res)
            setIcon(res.data.data.icon)
            setName(res.data.data.name)
            setFiles(parse(res.data.data.folderStructure))
        }
        if(res.status == 201){
            setFiles([])
        }  
    }
    getData(workSpaceId)
}
,[workSpaceId])

  useEffect(() => {
    //all i need to do with socket is telling other guys to fetch data when i have send it to database
    if(socket == null){
      return
    }
    const getData = async (workSpaceId) => {
      const res = await   send.get(backendURL + '/data/getFolder' , {
          params : {
              workspaceId : workSpaceId
          }
      })
     
      if(res.status == 200){
        
          setFiles([...parse(res.data.data.folderStructure)])
      }
      if(res.status == 201){
          setFiles([])
      }  
    
      
  }
    const handleLoadFileStructure = (workpaceId) => {
      getData(workSpaceId)
      setKeyTracker(keyTracker + 1)
    }
   
    socket.emit('join-folderstructure' , workSpaceId)
    socket.on('load-filestructure' , handleLoadFileStructure)

    return (
      () => {
        socket.off('load-filestructure' , handleLoadFileStructure)
        
      })
     
  },[socket , workSpaceId])

    const loop = (data, key, callback) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].key === key) {
            return callback(data[i], i, data);
          }
          if (data[i].children) {
            loop(data[i].children, key, callback);
          }
        }
    };
    const handleAddFile = ( type , id) => {

        const data = [ ...files ]
        if(currpos == '0') {
          const id = uuid()
            setFiles([ ...data ,  {

              key : id,
              name : 'Untitled',
              type : 'file',
              filetype : type,
              databaseId : id
              
          }])
            sendData([ ...data ,  {

              key : id,
              name : 'Untitled',
              type : 'file',
              filetype : type,
              databaseId : id
              
          }], workSpaceId)
            setKeyTracker( keyTracker + 1 )
        }
        else {
            loop( data , currpos , ( appendLocation , i , data ) => {
              if(appendLocation.type != 'folder'){
                return
              }
                appendLocation.children.splice( i , 0 , {
                  key : uuid(),
                  name : 'Untitled',
                  type : 'file',
                  filetype : type,
                  databaseId : id
                  
              } )
            } )
            setFiles(data)
            sendData(data , workSpaceId)
            setKeyTracker(keyTracker + 1)
        }
        
  }
    const handleAddFolder = ( ) => {

        const data = [ ...files ]
        if(currpos == '0') {
          const id = uuid()
            setFiles( [...data , {
              key : id,
              name : 'Untitled',
              type : 'folder',
              children : [
                  
              ], 
          }])
          sendData([ ...data ,  {

            key : id,
            name : 'Untitled',
            type : 'folder',
            databaseId : id
            
        }], workSpaceId)
            setKeyTracker( keyTracker + 1 )
        }
        else {
            loop( data , currpos , ( appendLocation , i , data ) => {
                appendLocation.children.splice( i , 0 , {
                  key : uuid(),
                  name : 'Untitled',
                  type : 'folder',
                  children : [
                      
                  ],
                  
              } )
            } )
            setFiles(data)
            sendData(data , workSpaceId)
            setKeyTracker(keyTracker + 1)
            
        }
       
    }
  const onSelect = (node) => {
    
    setCurrpos(node.key)
    if(node.type=='file'){
      setContent({type : node.filetype, databaseId : node.databaseId})
      setDisabled(true)
      if(node.filetype){
       
        if( node.filetype == 'doc' || node.filetype == 'calendar'){
          window.open(frontendURL + `/${node.filetype}/${node.key}` , '_blank')
        }
        
      }
    }
    else{
      setDisabled(false)
    }
   
  }

  const onDrop = (info) => {
    
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    
    const data = [...files];

   
    let dragObj;
    let removefrom;
    let removeindex;
    loop(data, dragKey, (item, index, arr) => {
      removefrom = arr;
      removeindex = index;
      dragObj = item;
    });
    if (!info.dropToGap) {
      loop(data, dropKey, (item) => {
        if(item.type != 'folder'){
           
            return;
        }
        item.children = item.children || [];
        
        item.children.unshift(dragObj);
        removefrom.splice(removeindex, 1);
      });
    } else if (
      (info.node.props.children || []).length > 0 &&
     
      info.node.props.expanded &&
   
      dropPosition === 1 
    ) {
      loop(data, dropKey, (item) => {
        if(item.type != 'folder'){
            return;
        }
        item.children = item.children || [];
       
        item.children.unshift(dragObj);
        removefrom.splice(removeindex, 1);
      });
    } else {
      let ar = [];
      let i;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
      removefrom.splice(removeindex, 1);
    }
    setFiles(data);
    sendData(data , workSpaceId)
  };
  const onExpand = (newKeys , { expanded , node } ) => {
    setExpandedKeys(newKeys)
    if( expanded == true ){
        setCurrpos( node.key )
    }
  }
  const handleDelete = () => {
    const data = [...files]
    loop(data , currpos , (location , i , data) =>{
      console.log(data[i])
      data.splice(i , 1)
    })
    setFiles([...data])
    sendData([...data] , workSpaceId)
  }
  const provideIcon = ( data ) => {
   
    if(data.type == 'folder'){
        return (
          '📁'
        )
    }
    else{ 
    
        switch(data.filetype){
            case 'calendar':
                return(
                    '📅'
                )
            
            case 'doc':
                return (
                  '📘'
                )
            case 'note':
                return(
                  '📝'
                )
            case 'board':
                  return (
                      '🖽'
                  ) 
            default : 
                return(
                  '📁'
                )
        }
        
    }
  }
  const handleAddDoc = () => {
    const id = uuid()
    window.open(frontendURL + `/documents/${id}` , '_blank')
    handleAddFile('doc' , id)
    setContent({type : 'doc', databaseId : id}) //this id corresponds to the file data in mongodb
  }
  const handleAddCalendar = () => {
    const id = uuid()
    window.open(frontendURL + `/calendar` , '_blank')
    handleAddFile('calendar' , id) 
    setContent({type : 'calendar', databaseId :id})
  }
  const handleAddBoard = () => {
    const id = uuid()
    handleAddFile('board' , id)
    setContent({type : 'board', databaseId : id})  
  }
  const handleAddNote = () => {
    const id = uuid()
    handleAddFile('note' , id)
    setContent({type : 'note', databaseId : id})
  }
  const handleRootAddClick = () => {
    setFiles(
      [
        ...files ,
        {
          key : uuid(),
          type : 'folder',
          name : 'Untitled',
          children : [
              
          ],
         
          
      }
      ]
   
    )
    sendData([
      ...files ,
      {
        key : uuid(),
        type : 'folder',
        name : 'Untitled',
        children : [
            
        ],    
    }
    ] , workSpaceId)
   
    setKeyTracker(keyTracker + 1)
  }
  const renderTreeNodes = (data) => {
    let nodeArr = data.map((item) => {
      console.log(item.name)
      if(item.emoji == null){
        item.emoji = (
          provideIcon({ type :item.type , filetype :item.filetype})
        )
      }
        item.title = (
          <div onClick={()=>{
            onSelect(item)
          }}
          className="node"
          >  
              <Icon 
                key={item.emoji }
                id={item.key} 
                emoji={item.emoji}
                setFiles={setFiles}
                sendData={sendData}
                workspaceId={workSpaceId}
              />
              <RenamableName
              key={item.key }
              name={item.name}
              setFiles={setFiles}
              sendData={sendData}
              workspaceId={workSpaceId}
              id={item.key}
            />
             <span style={{position : 'absolute' , right : '0'}}>
            <DropdownMenu icon={<MoreHorizIcon/>} popUp={false} anchorEl={anchor} setAnchorEl={setAnchor}>
                 {item.type == 'folder' ?(
                  <>
                  <MenuItem>
                    <IconButton onClick={
                      () => {
                        handleAddFolder() 
                        setAnchor(null)
                      }}>
                      <CreateNewFolderIcon/>
                      <Typography>
                        Add Folder
                      </Typography> 
                    </IconButton>
                  </MenuItem>
                  <MenuItem>
                    <IconButton onClick={
                      () => {
                        handleAddNote() 
                        setAnchor(null)
                      }}>
                        <StickyNote2Icon/>
                        <Typography>
                          Add Note
                        </Typography>
                    </IconButton>
                  </MenuItem>
                  <MenuItem>  
                    <IconButton onClick={
                      () => {
                        handleAddDoc() 
                        setAnchor(null)
                      }}>
                        <PostAddIcon></PostAddIcon>
                        <Typography>
                          Add Doc
                        </Typography>
                    </IconButton>
                  </MenuItem>
                  <MenuItem>
                    <IconButton onClick={
                      () => {
                        handleAddCalendar() 
                        setAnchor(null)
                      }}>
                        <EditCalendarIcon/>
                        <Typography>
                          Add Calendar
                        </Typography>
                    </IconButton>
                  </MenuItem>
                  <MenuItem>
                    <IconButton onClick={
                      () => {
                        handleAddBoard() 
                        setAnchor(null)
                      }}>
                        <ViewKanbanIcon/>
                        <Typography>
                          Add a Board
                        </Typography>
                    </IconButton>
                  </MenuItem>
                  <MenuItem>
                  <IconButton onClick={() => {
                      handleDelete()
                      setAnchor(null)
                    }}>
                      <DeleteIcon/>
                      <Typography>
                        Delete
                      </Typography>
                    </IconButton>
                     
                  </MenuItem>
                </>
                 ) 
                  : ''  
                }
                
                
            </DropdownMenu>
            </span>
          </div>
          
        )

      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item} type={item.type} filetype={item.filetype}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }

      return <TreeNode title={item.title} key={item.key}  />;
    });

    return nodeArr;
  };
  const handleSearchChange = (e) => {
    setText(e.target.value)
    setExpandedKeys([])
    const recur = ( data , name ) => {
        data.forEach((item) => {
            if (item.name.includes(name) == true ) {
              if( name == '' ){
                return
              }
              
              setExpandedKeys(
                (expandedKeys) => (
                  [
                    ...expandedKeys , item.key
                  ]
                )
              )
              item.se
            }
            if (item.children) {
              recur(item.children , name);
            }
        }
      )
  }
  recur( files , e.target.value )
  }
  const handleBlur = () => {
    setExpandedKeys([])
  }
  return (
    <div>
      
        <div className="file-explorer-buttons" style={{display : 'flex' , alignItems : 'center'}}>
            <div style={{margin : '4px'}}> {icon} </div>
           <p> {name} </p>
           <span>

           <IconButton sx={{  right : '0' , color:'#164863'}} onClick={

            () => {
              setClose(!close)
            }
           }>
              {close ? <KeyboardArrowDownIcon/> : <KeyboardArrowRightIcon/>}
            </IconButton>
           </span>
           <span>

            <IconButton sx={{  right : '0' , color:'#164863'}} onClick={handleRootAddClick}>

              <AddIcon/>
            </IconButton>
           </span>
          
        </div>
        {close && <Tree
        className="draggable-tree"
        draggable
        blockNode
        onDrop={onDrop}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        showIcon={true}
        treeData={files}
        autoExpandParent={true}
        key={keyTracker}
        >
          {renderTreeNodes(files)}
        </Tree>
      }
    </div>
    
  );
}