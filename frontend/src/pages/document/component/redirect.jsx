import { Navigate} from 'react-router-dom'
import {v4 as uuid} from 'uuid'
export default function Redirect ( ){

    return (
        <Navigate to={`/documents/${uuid()}`}></Navigate>
    )
}