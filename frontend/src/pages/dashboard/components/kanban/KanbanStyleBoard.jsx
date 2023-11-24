
import { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import DroppableList from './DropableList';
import '../css/KanbanBoard.css'
import CapsuleButton from './CapsuleButton';
import TaskEditor from './TaskEditor';
import { backendURL, send } from '../../../../global/request';
import AddBoard from './AddBoard';
import kanbanData from '../content/utils/kanbanData';
const colors = [ 'red' , 'yellow' , 'blue' , 'green' , 'purple' , 'pink'];

function KanbanStyleBoard( { data , databaseId , metaData} ) {
  const [boardData, setBoardData] = useState( data );
  const [ boardMetaData , setBoardMetaData ] = useState( metaData )
  const [ taskEditorActive , setTaskEditorActive ] = useState(true);
  const [ taskEditorData , setTaskEditorData ] = useState(null)
  const [ idTrack , setIdTrack ] = useState(100);
  
  useEffect(()=>{ //listen's to change's in prop
    //caused some isssus beware!!
    setBoardData(data)
  },[data])
  useEffect(
    () => {
      setBoardMetaData(metaData)
    }
    ,[metaData]
  )
  useEffect(()=>{
          return(
            () => {
              console.log(boardMetaData)
              console.log(boardData)
              send.post(backendURL + '/data/saveContent' , {
                  data : {
                      databaseId : databaseId,
                      content :  boardData ,
                      metaData : boardMetaData,
                      filetype :  'board',
                  }
                })
            }
          )
         
          }
        
    ,[boardData,databaseId,boardMetaData])

  function handleOnDragEnd(result) {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    var add;
    
    var active = parseInt(source.droppableId);
    var complete = parseInt(destination.droppableId);
    
    var activeData = boardData[active].data
    var completeData = boardData[complete].data
 
    var activeIndex = source.index 
    var completeIndex = destination.index
   
    if(active == complete){
        add = completeData.splice(activeIndex , 1)
        completeData.splice(completeIndex , 0 ,add[0] )
        boardData[complete].data = completeData
    }
    else{
        add = activeData[activeIndex]
        activeData.splice(activeIndex , 1)
        completeData.splice(completeIndex , 0 ,add )
        boardData[active].data = activeData
        boardData[complete].data = completeData
    }
 
    setBoardData([...boardData])
    
  }
  
  const handleDeleteTask = ( boardIndex , elementIndex  ) => {
    boardData[boardIndex].data.splice(elementIndex,1)
    setIdTrack((id)=>(id + 1)) //workaround for some bug
    //something is wrong with state
  }
  const handleEditTask = (boardIndex , elementIndex , newData) => {
    boardData[boardIndex].data[elementIndex] = newData
    setBoardData([...boardData])
    setTaskEditorData(null)
  }
  const handleMountEditTask = (boardIndex , elementIndex) => {
    setTaskEditorActive(true)
    setIdTrack(idTrack+1)
    setTaskEditorData(boardData[boardIndex].data[elementIndex])
  }
  if(boardData.map == null||boardMetaData.label == null||boardMetaData.label.map == null){
    return (
      <>
        NULL
      </>
    )
  }
  return (
    <div className="KanbanStyleBoard">
        <DragDropContext onDragEnd={handleOnDragEnd}>
        {
          boardData.map((data , index) => (
                <div key={index} className='drop-list'>
                    <div className='list-header'>
                        <div className='list-color' style={{backgroundColor:colors[index]}}></div>
                        <div className='list-title'>
                            <span className='list-title-inner'>
                                {data.name}
                            </span>
                            <span className='list-title-inner'>
                                {data.data.length}
                            </span>
                        </div>
                    </div>
                  <div className='kanban-board-content'>
                    <DroppableList 
                    characters={data.data} 
                    name={data.name} 
                    index={index} 
                    handleDelete={handleDeleteTask} 
                    setBoardData={setBoardData}
                    handleMountEditTask={handleMountEditTask} //mounts the task editor to edit the current task
                    />
                    <CapsuleButton text={'Add a Task'} handler={() => {
                      setTaskEditorActive(!taskEditorActive)
                    }}/>
                  </div>  
                   
                </div>
                
            ))   
        }

        </DragDropContext>
        <AddBoard 
        setBoardData={setBoardData} 
        boardData={boardData}
        />
        <div className='task-editor-div'>
          
             {
              taskEditorActive&& <TaskEditor 
              setTaskEditorActive={setTaskEditorActive}
              setBoardData={setBoardData}
              boardData={boardData} 
              setBoardMetaData={setBoardMetaData}
              boardMetaData={boardMetaData}
              setIdTrack={setIdTrack}
              idTrack={idTrack}
              handleEditTask={handleEditTask}
              taskEditorData={taskEditorData}
              setTaskEditorData={setTaskEditorData}
              />
             } 
          </div>
    </div>
  );
}

export default KanbanStyleBoard;