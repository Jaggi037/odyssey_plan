import { Droppable } from "react-beautiful-dnd";
import   DraggableItem  from './Dragable'

const colors = [ 'red' , 'yellow' , 'blue' , 'green' , 'purple' , 'pink']; //array of colors


export default function DroppableList({characters , name , style , index , handleDelete , setBoardData , handleMountEditTask}){
  const boardIndex = index
    return (
        
<Droppable droppableId={index.toString()}>          
    {(provided) => (
      <div className="characters" {...provided.droppableProps} ref={provided.innerRef} style={style}> 
        {characters.map((item, index) => {
          return (
            <DraggableItem 
            key={index}
            id={item.id} 
            index={index} 
            name={item.name} 
            thumb={item.thumb} 
            itemData={item}
            handleDelete={handleDelete} 
            boardIndex={boardIndex} 
            setBoardData={setBoardData}
            handleMountEditTask={handleMountEditTask}
            />
          );
        })}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
     
       
    )
}