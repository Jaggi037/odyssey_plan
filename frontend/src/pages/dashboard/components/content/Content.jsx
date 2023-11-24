import { useEffect, useState } from "react"
import KanbanStyleBoard from "../kanban/KanbanStyleBoard"
import NoteEditor from "../NoteEditor"
import { backendURL, send } from "../../../../global/request"
import kanbanData from "./utils/kanbanData"
import noteData from "./utils/noteData"

export default function Content({ view , databaseId }){
    const [contentData , setContentData] = useState( view == 'board' ? kanbanData : noteData ) 
    const [ metaData , setMetaData ] = useState({label : []})
    const [ backendId , setBackendId ] = useState( databaseId )
    const [ componentType , setComponentType ] = useState( view )
    useEffect(
        () => { 
            setBackendId( databaseId )
        },[
            databaseId 
        ]
    )
    useEffect(
        () => {
            setComponentType(view)
        },
        [
            view
        ]
    )
    useEffect(
        () => {
                const getData = async ( databaseId ) => {
                const res = await send.get(backendURL + '/data/getContent' , { 
                    params : {
                        databaseId :databaseId
                    }
                })
               
                if(res.status == 200){
                    console.log(res.data)
                    setContentData(res.data.data)
                    setComponentType(res.data.type)
                    setMetaData(res.data.metaData)
                }
                if(res.status == 201){
                    console.log(201)
                    switch(componentType){
                        case 'board' : 
                            setContentData(kanbanData)
                            setMetaData({ label : [] })
                            break;
                        case 'note':
                            setContentData(noteData)
                            setMetaData({ label : [] })
                            break;
                        
                    }
                }
                
            }
            getData(backendId)
        }
    , [backendId , componentType])
    
    switch( componentType ){
        case 'board':
            return (
                <KanbanStyleBoard 
                data={contentData} 
                metaData={metaData}
                databaseId={databaseId}
                key={databaseId}
                />
            )
        case 'note':
            return(
                <NoteEditor 
                data={contentData} 
                metaData={metaData}
                databaseId={databaseId}
                key={databaseId}
                />
            )
        case 'doc':
            return(
                <div>
                    go to see the doc link
                    or show some data here
                </div>
            )
        case 'calendar':
            return(
                <div>
                    go to see the calendar link
                    or show some data here
                </div>
            )
        default :
            return (
                <div>
                    we donn know
                </div>
            )
    }
}