import { useRecoilState, useRecoilValue } from "recoil";
import Codemirror from "codemirror";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";

import { CodeAtom, isDarkModeAtom } from "@/atoms/Editor";
import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { EVENTS } from "@/Events";
import { roomId } from "@/atoms/JoinRoom";
interface CodeEditorProps {
  socketRef: React.MutableRefObject<Socket | null>;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ socketRef }) => {
  const [isDarkMode] = useRecoilState(isDarkModeAtom);
  const codeEditorRef = useRef<HTMLTextAreaElement | null>(null);
  const editorInstanceRef = useRef<Codemirror.Editor | null>(null);
  const [code, setCode] = useRecoilState(CodeAtom);
  const roomid = useRecoilValue(roomId)

  useEffect(() => {
    if (codeEditorRef.current) {
      if (!editorInstanceRef.current) {
        editorInstanceRef.current = Codemirror.fromTextArea(
          codeEditorRef.current,
          {
            mode: {
              name: "javascript",
              json: true,
            },
            theme: isDarkMode ? "dracula" : "default",
            autoCloseTags: true,
            autoCloseBrackets: true,
            lineNumbers: true,
            viewportMargin: Infinity,
          }
        );

        editorInstanceRef.current.on("change", (instance, changes) => {
          const { origin } = changes;
          const codeGet = instance.getValue();
          console.log("code value",codeGet, roomid)
          if (origin !== "setValue") {
            socketRef.current?.emit(EVENTS.CODE_CHANGE, {
              roomid,
              codeGet,
            });
          }
        });
      } else {
        editorInstanceRef.current.setOption(
          "theme",
          isDarkMode ? "dracula" : "default"
        );
      }
    }
  }, [setCode, isDarkMode]);

  useEffect(() => {
    socketRef.current?.on(EVENTS.CODE_CHANGE, ({ codeGet }) => {
      if (codeGet !== null) {
        editorInstanceRef.current?.setValue(codeGet);
      }
    });
  }, [socketRef.current]);

  return (
    <textarea
      ref={codeEditorRef}
      id="realTimeCodeEditor"
      value={code}
      onChange={(e) => setCode(e.target.value)}
      style={{
        display: "none",
      }}
    />
  );
};

export default CodeEditor;
