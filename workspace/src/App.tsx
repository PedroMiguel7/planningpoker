// planningpoker/workspace/src/App.tsx
import React, { useState } from 'react';

import { AuthScreen } from './components/AuthScreen';
import { PlanningRoom } from './components/PlanningRoom';
import { connectWebSocket, disconnectWebSocket } from './services/socket';
import { Room, User } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);

  const handleJoinRoom = (user: User, room: Room) => {
    setCurrentUser(user);
    setCurrentRoom(room);
    // Conecta ao WebSocket quando o utilizador entra numa sala
    connectWebSocket(room.code);
  };

  const handleLeaveRoom = () => {
    setCurrentUser(null);
    setCurrentRoom(null);
    // Desconecta quando sai
    disconnectWebSocket();
  };

  if (!currentUser || !currentRoom) {
    return <AuthScreen onJoinRoom={handleJoinRoom} />;
  }

  return (
    <PlanningRoom
      user={currentUser}
      room={currentRoom}
      onLeaveRoom={handleLeaveRoom}
    />
  );
}

export default App;