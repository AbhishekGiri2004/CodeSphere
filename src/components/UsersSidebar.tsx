
import { useCollaborationContext } from "@/contexts/CollaborationContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function UsersSidebar() {
  const { 
    activeUsers, 
    usersOpen, 
    setUsersOpen 
  } = useCollaborationContext();

  if (!usersOpen) {
    return (
      <Button 
        variant="ghost" 
        className="absolute top-2 left-2 z-10"
        onClick={() => setUsersOpen(true)}
        size="sm"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div className="w-64 h-full border-r border-border bg-secondary flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h2 className="font-semibold text-foreground">Collaborators</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setUsersOpen(false)}
          className="h-7 w-7 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-grow">
        {activeUsers.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            No active users
          </div>
        ) : (
          <div className="p-2">
            {activeUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center p-2 rounded-md hover:bg-accent mb-1"
              >
                <div
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: user.color }}
                  title={user.lastActivity > new Date(Date.now() - 300000) ? "Online" : "Away"}
                />
                <div className="flex-grow">
                  <div className="font-medium text-sm">{user.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Joined {formatDistanceToNow(user.joinedAt, { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
