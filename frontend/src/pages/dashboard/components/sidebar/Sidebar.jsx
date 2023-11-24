import RecursiveSidebar from "./RecursiveFileExplorer";
import '../css/Sidebar.css'


export default function Sidebar({setContent , setPersonalSpace , personalSpace}){
    
    return (
        <div className="sidebar-div">
                <RecursiveSidebar 
                setFiles={setPersonalSpace}
                files={personalSpace}
                index={0} 
                setContent={setContent}
                name={'personal space'}
                ></RecursiveSidebar>
        </div> 
    )
}