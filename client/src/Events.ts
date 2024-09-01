type Event={
    JOIN:string,
    JOINED:string,
    DISCONNECTED:string,
    CODE_CHANGE:string,
    SYNC_CODE:string,
    LEAVE:string,

}


export const EVENTS:Event = {
    JOIN:'join',
    JOINED:'joined',
    DISCONNECTED:'disconnected',
    CODE_CHANGE:'code-change',
    SYNC_CODE:'sync-code',
    LEAVE:'leave'
}