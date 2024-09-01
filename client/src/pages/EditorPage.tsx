import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X} from "lucide-react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";
import { Button } from "@/components/ui/button";
import { useRecoilState, useRecoilValue } from "recoil";
import { CodeAtom, isDarkModeAtom, isSidebarOpenAtom } from "@/atoms/Editor";
import UserCard from "@/utils/UserCard";
import { Socket } from "socket.io-client";
import SidebarButtons from "@/utils/SidebarButtons";
import { useEffect, useRef } from "react";
import { socketInit } from "@/socket/socket";
import { EVENTS } from "@/Events";
import { roomId , Username } from "@/atoms/JoinRoom";

export default function EditorPage() {
  const [isDarkMode, setIsDarkMode] = useRecoilState(isDarkModeAtom);
  const [isSidebarOpen, setIsSidebarOpen] = useRecoilState(isSidebarOpenAtom);
  const [code, setCode] = useRecoilState(CodeAtom);
  const roomid= useRecoilValue(roomId)
  const username = useRecoilValue(Username)
  type SocketType = Socket | null;
  const socketRef = useRef<SocketType>(null)

  useEffect(()=>{
   const init=async()=>{
    socketRef.current = await socketInit()
    socketRef.current.emit(EVENTS.JOIN ,{
      roomid,
      username 
    })
    }
    init()
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    }

  },[])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
        <UserCard />
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
        <main className={`flex-1 pt-4 transition-all duration-300 ${isSidebarOpen ? " pl-64" : "p-4"} bg-gray-100 dark:bg-gray-900 overflow-auto`}>
  <Editor
    value={code}
    onValueChange={(code) => setCode(code)}
    highlight={(code) => highlight(code, languages.js, "javascript")}
    padding={10}
    style={{
      fontFamily: '"Fira code", "Fira Mono", monospace',
      fontSize: 14,
      backgroundColor: isDarkMode ? "#1e1e1e" : "#f5f5f5",
      color: isDarkMode ? "#a6a6a6" : "#333",
      borderRadius: "4px",
      minHeight: "calc(100vh - 6.3rem)",
      width: '100%', 
     
    }}
  />
</main>

      
      </div>
    </div>
  );
}
