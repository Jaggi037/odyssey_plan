import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { useCallback, useEffect, useState } from 'react'
import toolbarOptions from '../utils/toolBarOptions'
import io from 'socket.io-client'
import { useParams } from 'react-router-dom'
import QuillCursors from 'quill-cursors';
import { useCookies } from 'react-cookie'
import color from '../utils/colorSchemes'
Quill.register('modules/cursors', QuillCursors);


export default function TextEditor () {
    const [ socket , setSocket ] = useState();
    const [ quill , setQuill ] = useState();
    const [ cursors , setCursors ] = useState();
    const {id : documentId} = useParams(); //getting the document room id
    const [ ownId , setOwnId ] = useState();
    const [colors , setColors] = useState(color)
    const [ cookie ] = useCookies(['']);
    
    useEffect(
        () => { //get's  and set's the ID
            const id = cookie.userId;
            setOwnId(id);
            
        }
        ,
        []
    )
    useEffect(()=>{ //effect that connect's the document browser with backend
        const socket = io("http://localhost:3001");
       
        setSocket(socket)
        return (
            () => {
                socket.disconnect()
            }
            
        )
    }    
    ,[])
    useEffect(() => {
        if(socket == null || quill == null || cursors == null){
            return ;
        }
        socket.once('load-document' , ( document , activeMembers ) => { //wait's for the server to retrieve the document and loads it
            quill.setContents(document);
            quill.enable(); 
            for(let i in activeMembers){ //create cursor's for all the previously joined members
                cursors.createCursor( activeMembers[i].Id , activeMembers[i].name , 'orange')
            }
        })
        const newMemberHandler = (memberId , name) => { //create cursor for new member on joining
            if(memberId == ownId){
                return ;
            }
            let i = 0;
            for(i = 0 ; i < colors.length ; i++){
                if( colors[i].occupied == false ){ //associate a color with each guy
                    color.occupied = true;
                    break ;
                }
            }

            cursors.createCursor(memberId , name , colors[i].color )
        }
        const movementHandler = ( memberId , selection ) => { // move remote user's cursor
            console.log(memberId)
            cursors.moveCursor(memberId , selection)
            console.log(cursors.cursors())
        }
        const memberLeftHandler = (memberId) => { //remove a cursor once the user leave's
            cursors.removeCursor( memberId )
        }

        socket.emit( 'join-document-room' , documentId , ownId)  
        socket.on( 'new-member-joined' , newMemberHandler)  //set the handler's to their events
        socket.on( 'member-left' ,  memberLeftHandler)
        socket.on( 'cursor-movement' , movementHandler)

        return (
            () => {
                socket.on( 'new-member-joined' , newMemberHandler) //cleanup
                socket.on( 'member-left' ,  memberLeftHandler)
                socket.on( 'cursor-movement' , movementHandler)
            }
        )

    },[socket , quill, documentId , cursors])
    useEffect( //this effect save's the file before we unload and tell's the user to delete the docs
        () => {
            if(socket == null || quill == null) {
                return
            }
            const handler = () => {
                socket.emit('save-document' , documentId , quill.getContents() ); //event to save the document in the backend
                socket.emit( 'member-left' , documentId , ownId ); //event to inform other peers to delete the cursor
            }
            window.addEventListener('unload' , handler ); 
            window.addEventListener('beforeunload' , handler);
            return (
                () => {
                    window.removeEventListener('unload', handler); //cleanup
                    window.removeEventListener('beforeunload' , handler)
                }
            )
        },
        [socket , quill]
    )
    useEffect(() => {//effect to detect delta's and send it to other peers
        if( quill==null || socket == null ){
            return ; 
        } 
        const quillHandler = ( delta , oldDelta , source ) => { //
            if(source === 'user'){
                socket.emit( 'send-changes' , delta , documentId);
            }
        } 
        const socketHandler = (delta) => {
            quill.updateContents( delta );
        }

        quill.on('text-change' , quillHandler ); //set event's to their handler's
        socket.on('recieve-change' , socketHandler );

        return (
            () => {
                quill.off( 'text-change' , quillHandler ) //cleanup
                socket.off( 'recieve-change' , socketHandler )
            }
        )
    },[quill , socket])

    useEffect(() => {
        if( quill == null || socket == null || cursors == null || ownId == null){
            return
        }
        const quillHandler = (selectNew , selectOld , source) => {
            
                const selection = quill.getSelection();
                socket.emit('cursor-movement', documentId , ownId , selection)
                
        }
        quill.on('selection-change' , quillHandler)

        return(() => {
            quill.off('selection-change' , quillHandler);
        })
    }, [quill , socket , cursors , ownId])
    const callbackRef = useCallback( //effect to create the editor after the div named container is rendered
        (wrapper) => {
            if( wrapper == null){
                return 
            }
            wrapper.innerHTML = ""
            const editor = document.createElement('div');
            wrapper.append(editor);
            const q = new Quill( editor , { theme : 'snow',
                modules : {
                    toolbar : toolbarOptions,
                    cursors : true ,
                }
            } );
            q.disable();
            q.setText('Loading ....')
            setQuill(q);
            const c = q.getModule('cursors');
            setCursors(c);
        }    
    , [])
    return (
        <div className="container" ref={callbackRef}></div>
    )
}