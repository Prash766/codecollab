import {atom} from 'recoil'

export const roomId = atom<string>({
    key:"roomIdatom",
    default:localStorage.getItem('roomid') || '',
    effects:[
        ({onSet})=>{
            onSet(id=>{
                localStorage.setItem('roomid', id)
            })
        }
    ]


})

export const Username = atom<string>({
    key:"usernameatom",
    default:""
})