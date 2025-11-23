import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";
import { useEditorContext } from "@/contexts/EditorContext";
import { Code, PencilRuler, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function Index() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, generateUserColor } = useUserContext();
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    // Set username from context if available
    if (currentUser?.name) {
      setUsername(currentUser.name);
    }
  }, [currentUser]);

  const handleJoinRoom = () => {
    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }
    
    if (!roomCode.trim()) {
      toast.error("Please enter a room code");
      return;
    }
    
    setIsJoining(true);
    
    // Create a user if none exists
    if (!currentUser) {
      setCurrentUser({
        id: crypto.randomUUID(),
        name: username,
        color: generateUserColor(),
        joinedAt: new Date(),
        isActive: true
      });
    } else if (currentUser.name !== username) {
      // Update username if changed
      setCurrentUser({
        ...currentUser,
        name: username
      });
    }
    
    // Simulate API call to check if room exists
    setTimeout(() => {
      // Join the room
      navigate(`/room/${roomCode}`);
      setIsJoining(false);
    }, 800);
  };
  
  const handleCreateRoom = () => {
    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }
    
    setIsCreating(true);
    
    // Create a user if none exists
    if (!currentUser) {
      setCurrentUser({
        id: crypto.randomUUID(),
        name: username,
        color: generateUserColor(),
        joinedAt: new Date(),
        isActive: true
      });
    } else if (currentUser.name !== username) {
      setCurrentUser({
        ...currentUser,
        name: username
      });
    }
    
    // Create a random room ID and navigate to it
    setTimeout(() => {
      const randomRoomId = Math.random().toString(36).substring(2, 9).toUpperCase();
      navigate(`/room/${randomRoomId}`);
      setIsCreating(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-2xl px-4">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-codeSphere-blue-light to-codeSphere-purple-primary bg-clip-text text-transparent mb-4">
            CodeSphere
          </h1>
          <p className="text-xl text-muted-foreground">
            A Java-Centric Collaborative Code Editor with Whiteboard & Real-Time Execution
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card rounded-lg p-6 flex flex-col items-center text-center">
            <div className="bg-codeSphere-blue-primary/10 p-3 rounded-full mb-4">
              <Code className="w-8 h-8 text-codeSphere-blue-primary" />
            </div>
            <h3 className="font-medium mb-2">Code Editor</h3>
            <p className="text-sm text-muted-foreground">
              Multi-language support with syntax highlighting and real-time execution
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 flex flex-col items-center text-center">
            <div className="bg-codeSphere-purple-primary/10 p-3 rounded-full mb-4">
              <PencilRuler className="w-8 h-8 text-codeSphere-purple-primary" />
            </div>
            <h3 className="font-medium mb-2">Whiteboard</h3>
            <p className="text-sm text-muted-foreground">
              Draw diagrams, flowcharts, and illustrations to explain your code
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 flex flex-col items-center text-center">
            <div className="bg-codeSphere-purple-light/10 p-3 rounded-full mb-4">
              <MessageSquare className="w-8 h-8 text-codeSphere-purple-light" />
            </div>
            <h3 className="font-medium mb-2">Real-Time Collaboration</h3>
            <p className="text-sm text-muted-foreground">
              Code together with live cursors, chat, and presence indicators
            </p>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Your Name
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
              placeholder="Enter your name"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="roomCode" className="block text-sm font-medium mb-1">
              Room Code
            </label>
            <Input
              id="roomCode"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="w-full"
              placeholder="Enter room code to join"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleJoinRoom} 
              disabled={!username.trim() || !roomCode.trim() || isJoining}
              className="flex-1 bg-codeSphere-blue-primary hover:bg-codeSphere-blue-dark"
            >
              {isJoining ? "Joining..." : "Join Room"}
            </Button>
            <Button 
              onClick={handleCreateRoom}
              disabled={!username.trim() || isCreating}
              className="flex-1 bg-codeSphere-purple-primary hover:bg-codeSphere-purple-dark"
            >
              {isCreating ? "Creating..." : "Create New Room"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
