

export default function trim(data:string){
    if(data.length <=35){
        return data;
    }
    return data.slice(0,35)+"..";
}
