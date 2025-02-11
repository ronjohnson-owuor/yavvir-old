import moment from 'moment-timezone'
export const formatDate = (isoString:string) =>{
    // convert the time to EAT 
    const date  = moment(isoString);
    const today = moment().startOf("day");

    if(date.isSame(today,"day")){
        return `Today,${date.format("h:mmA")} EAT`;
    }else{
        return `${date.format("dddd, h:mmA")} EAT`;
    }
}