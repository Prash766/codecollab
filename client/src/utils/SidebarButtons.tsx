import { roomId } from "@/atoms/JoinRoom"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { LogOut } from "lucide-react"
import { useRecoilValue } from "recoil"
import { toast } from "sonner"

const SidebarButtons = () => {
    const roomIDCOde = useRecoilValue(roomId)

    function handleCopyClick(){
        console.log(roomIDCOde)
        navigator.clipboard.writeText(roomIDCOde).then(()=>{
            toast.success("Copied to the Clipboard")
        })
        

    }
  return (
    <>
    <Button onClick={handleCopyClick} className="w-full" variant="outline">
    <Copy   className="mr-2 h-4 w-4" /> Copy Room ID
  </Button>
  <Button className="w-full" variant="destructive">
    <LogOut className="mr-2 h-4 w-4" /> Leave Room
  </Button>
    </>
  )
}

export default SidebarButtons