import moment from 'moment-timezone'
export const formatDate = (isoString:string) =>{
    // convert the time to EAT 
    const date  = moment(isoString).tz("Africa/Nairobi");
    const today = moment().tz("Africa/Nairobi").startOf("day");

    if(date.isSame(today,"day")){
        return `Today,${date.format("h:mmA")} EAT`;
    }else{
        return `${date.format("dddd, h:mmA")} EAT`;
    }
}