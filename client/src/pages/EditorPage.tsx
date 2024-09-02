import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRecoilState, useRecoilValue } from "recoil";
import { isDarkModeAtom, isSidebarOpenAtom, joinedClients } from "@/atoms/Editor";
import UserCard from "@/utils/UserCard";
import { Socket } from "socket.io-client";
import SidebarButtons from "@/utils/SidebarButtons";
import { useEffect, useRef } from "react";
import { socketInit } from "@/socket/socket";
import { EVENTS } from "@/Events";
import { roomId , Username } from "@/atoms/JoinRoom";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CodeEditor from "@/utils/CodeEditor";


export default function EditorPage() {
  const [isDarkMode, setIsDarkMode] = useRecoilState(isDarkModeAtom);
  const [isSidebarOpen, setIsSidebarOpen] = useRecoilState(isSidebarOpenAtom);
  const[newClients , setNewClients] = useRecoilState(joinedClients)

  const roomid = useRecoilValue(roomId);
  
  const usernameRecoil = useRecoilValue(Username);
  const errorNavigate = useNavigate();

  type SocketType = Socket | null;
  type Obj  ={
    socketid:string,
    username:string

}
  type joinedUserData ={
    clients:Array<Obj>,
    username:string,
    socketid:string
  }
  const socketRef = useRef<SocketType>(null);

  function handleError(err: Error) {
    console.log("Socket error", err);
    toast.error("Socket connection failed");
    errorNavigate("/", { replace: true });
  }

  useEffect(() => {
    const init = async () => {
      socketRef.current = await socketInit();
      socketRef.current.on("connect-error", (err) => handleError(err));
      socketRef.current.on("connect-failed", (err) => handleError(err));
      socketRef.current.emit(EVENTS.JOIN, {
        roomid,
        usernameRecoil,
      });
      socketRef.current.on(EVENTS.JOINED ,({clients,username,socketid}:joinedUserData)=>{
        if(username!== usernameRecoil){
          toast.success(`${username} has joined the room`)
          console.log(`${username} has joined `)
        }
        setNewClients(clients)
        

      })

      socketRef.current.on(EVENTS.DISCONNECTED,({socketid , username}:Obj)=>{
        toast.success(`${username} left the room`)
        setNewClients(prev => {
          return prev.filter(
            (client) => client.socketid!== socketid
          )
        })
      })



    };

    init();
    return () => {
      if (socketRef.current) {
        socketRef.current.off(EVENTS.JOINED)
        socketRef.current.off(EVENTS.DISCONNECTED)
        socketRef.current.disconnect();
      }
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!usernameRecoil || !roomId) {
    <Navigate to="/" />;
  }

  return (
    <div
      className={`min-h-screen flex transition-colors duration-300 ${
        isDarkMode ? "dark" : ""
      }`}
    >
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 21 }}
            className="fixed inset-y-0 left-0 w-64 bg-gray-800 text-white p-4 z-50 flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">CodeCollab</h2>
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto mb-24">
              <div className="space-y-4  ">
              {newClients.map((e:Obj )=> <UserCard key={e.socketid} username={e.username} />)}
              </div>
            </div>
            <div className=" absolute space-y-2 bottom-4 left-4 right-4">
              <SidebarButtons />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? (
              <Sun className="h-6 w-6" />
            ) : (
              <Moon className="h-6 w-6" />
            )}
          </Button>
        </header>
        <main
          className={`flex-1 pt-4 transition-all duration-300 ${
            isSidebarOpen ? " pl-64" : "p-4"
          } bg-gray-100 dark:bg-gray-900 overflow-auto`}
        >
            
  <CodeEditor socketRef ={socketRef}/>
  
         
        </main>
      </div>
    </div>
  );
}
