import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { v4 as uuid4 } from "uuid";
import { useRecoilState } from "recoil";
import { roomId, Username } from "@/atoms/JoinRoom";
import { useState } from "react";
import { X } from "lucide-react";
import { KeyboardEvent } from "react";
import { toast } from "sonner";

export default function Join() {
  const [roomID, setRoomID] = useRecoilState(roomId);
  const [isNewID, setNewRoomId] = useState<boolean>(false);
  const [username, setUsername] = useRecoilState(Username);
  const navigate = useNavigate();

  function handleEnterClick(e: KeyboardEvent<HTMLInputElement>) {
    if ((e as KeyboardEvent).code === "Enter") {
      toast.success(isNewID ? "New Room Created" : "Room Joined");
      navigate(`/editor/${roomID}`, { replace: true });
      return;
    }
  }

  function handleJoinClick() {
    if (roomID.trim().length === 0) {
      toast.error("Enter Room ID");
      return;
    }

    if (username.trim().length === 0) {
      toast.error("Enter Username");
      return;
    }
    if (username.length < 4) {
      toast.error("Username should be at least 4 characters");
      return;
    }
    toast.success(isNewID ? "New Room Created" : "Room Joined");

    navigate(`/editor/${roomID}`, { replace: true });
  }

  function handleClick() {
    const id = uuid4();
    setRoomID(id);
    setNewRoomId(true);
  }
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Join Room
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="room-id">Paste or Enter Room ID</Label>
              {isNewID ? (
                <div className="relative">
                  <Input
                    value={roomID}
                    onChange={(e) => !isNewID && setRoomID(e.target.value)} // Update only if isNewID is false
                    className="pr-12 cursor-default"
                    id="room-id"
                    placeholder="Enter Room ID"
                    readOnly={isNewID}
                    onKeyUp={handleEnterClick}
                  />

                  <X
                    onClick={() => {
                      setRoomID("");
                      setNewRoomId(false);
                    }}
                    className="absolute right-0 top-0 m-2 mt-2 w-5 h-5 text-sm bg-white text-black rounded cursor-pointer"
                  />
                </div>
              ) : (
                <Input
                  value={roomID}
                  onChange={(e) => setRoomID(e.target.value)}
                  id="room-id"
                  placeholder="Enter Room ID"
                  required
                  onKeyUp={handleEnterClick}
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                id="username"
                placeholder="Enter your username"
                required
                onKeyUp={handleEnterClick}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button onClick={handleJoinClick} className="w-full">
              Join Room
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Don't have a room ID?{" "}
              <Link
                to=""
                onClick={handleClick}
                className="text-primary hover:underline"
              >
                Click here to create room
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      <footer className="h-12 p-2 bg-yellow-500 text-center text-muted-foreground">
        Built with <span className="text-yellow-500">💛</span> - Prashant
      </footer>
    </div>
  );
}
