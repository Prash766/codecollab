import { roomId, Username } from "@/atoms/JoinRoom";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { Socket } from "socket.io-client";
import { toast } from "sonner";

interface PropType {
  socketRef: React.MutableRefObject<Socket | null>;
}

const SidebarButtons: React.FC<PropType> = ({ socketRef }) => {
  const roomIDCOde = useRecoilValue(roomId);
  const navigate = useNavigate();

  function leaveRoomHandle() {
    navigate("/", { replace: true });
  }

  function handleCopyClick() {
    console.log(roomIDCOde);
    navigator.clipboard.writeText(roomIDCOde).then(() => {
      toast.success("Copied to the Clipboard");
    });
  }
  return (
    <>
      <Button onClick={handleCopyClick} className="w-full" variant="outline">
        <Copy className="mr-2 h-4 w-4" /> Copy Room ID
      </Button>
      <Button
        onClick={leaveRoomHandle}
        className="w-full"
        variant="destructive"
      >
        <LogOut className="mr-2 h-4 w-4" /> Leave Room
      </Button>
    </>
  );
};

export default SidebarButtons;
