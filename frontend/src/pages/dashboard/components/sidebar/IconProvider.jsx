import { useState } from 'react';

import EmojiPicker from 'emoji-picker-react';

export default function Icon ({ emoji , setFiles , id , sendData , workspaceId}){
    const [ emo , setEmo ] = useState(emoji)
    const [ editable , setEditable ] = useState(false)
    const handleDoubleClick = () => {
        setEditable(!editable)
    }

    const handleEmojiClick = (e) => {
        setEditable(false)
        setEmo(e.emoji)
        const loop = ( data , key ) => {
       
            data.forEach((item) => {
                if (item.key == key) {
                  item.emoji = e.emoji;
                }
                if (item.children) {
                  loop(item.children , key);
                }
            }
            )
        }
       
        setFiles((files) => {
            loop( files , id )
            if( sendData != null ){
                sendData(files , workspaceId)
                console.log(files)
            }
            return [...files]
        })
    }

    return (
        !editable?  (<span 
                    onDoubleClick={handleDoubleClick}
                    style={{
                        fontSize : '3vh'
                    }}
                    >
                        {emo}
                    </span>
                    ):
                    (
                       editable&&
                       (
                        <div>
                            <EmojiPicker 
                            onEmojiClick={handleEmojiClick}
                            />
                        </div>
                       )
                       
                    )    
    )
}