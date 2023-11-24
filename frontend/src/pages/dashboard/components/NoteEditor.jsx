
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { v4 as uuid } from "uuid";
import { backendURL, send } from '../../../global/request'
import "@blocknote/core/style.css";
import { useEffect, useState } from "react";
import noteData from "./content/utils/noteData";

export default function NoteEditor({data , databaseId , metaData}) {
    const [ noteMetaData , setNoteMetaData ] = useState(metaData)
    const  [ markdown , setMarkdown ] = useState( Array.isArray(data)==true ? noteData : data )
    const saveBlocksAsMarkdown = async (editor) => {
      const newMarkdown = await editor.blocksToMarkdown(editor.topLevelBlocks);
      setMarkdown(newMarkdown);
    };
    const editor = useBlockNote({
      uploadFile : async (uploadFile) => {
          const formData = new FormData();
          formData.append('file', uploadFile);
  
          const id = uuid()
          const res = await send.post('http://localhost:3002/serve/api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
            ,
            params : {
              id : id
            }
          })
          console.log(res.data)
          return `http://localhost:3002/serve${res.data.endpoint}?id=${res.data.path}`
        },
      onEditorContentChange : (editor) => {
        saveBlocksAsMarkdown(editor)
      },
      onEditorReady : async () => {
        const content = await editor.markdownToBlocks(markdown)
        editor.replaceBlocks(editor.topLevelBlocks, content )
      }
    }
    )
    useEffect(
      () => {
        const update = async (text) => {
          const content = await editor.markdownToBlocks(text)
          editor.replaceBlocks(editor.topLevelBlocks, content )
        }
        console.log(data)
        update(data)
        setMarkdown(data)
      },
      [ data ]
    )
   
    useEffect(()=>{
      return(
        ()=>{

            send.post(backendURL + '/data/saveContent' , {
              data : {
                    databaseId : databaseId,
                    content :  markdown,
                    filetype :  'note',
                    metaData : noteMetaData
                }
              })
            }
          )
      },[markdown,databaseId,noteMetaData])

  return (
    <>
      <BlockNoteView 
      editor={editor} 

      theme={'light'}

      />
    </>
  )
          
}