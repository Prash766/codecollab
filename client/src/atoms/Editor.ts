import {atom} from  'recoil'

export const CodeAtom = atom<string>({
    key:"codeatom",
    default:`function add(a, b) {\n  return a + b;\n}`
})


export const isSidebarOpenAtom = atom<boolean>({
    key:"isSidebarAtom",
    default:false

})

export const isDarkModeAtom = atom<boolean>({
    key:"isDarkModeAtom",
    default:true
})

