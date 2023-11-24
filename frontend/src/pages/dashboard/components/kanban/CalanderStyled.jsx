import '../css/Calander.css'
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
export default function CalendarStyled ( {setDate = ()=>{}, date = new Date()} ){
    
    return( //some bug has arised here that is causing troubles
        //fix it or find a alternative for this calend
        <Calendar shouldHighlightWeekends calendarClassName='responsive-calendar' ></Calendar>
        
    )
}