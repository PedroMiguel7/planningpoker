// planningpoker/workspace/src/components/PlanningRoom.tsx
import React, { useEffect, useState } from 'react';

import { addEventListener, removeEventListener, sendEvent } from '../services/socket';
import { ChatMessage, Room, Story, User } from '../types';
import { Chat } from './Chat';
import { ParticipantsList } from './ParticipantsList';
import { ResultsPanel } from './ResultsPanel';
import { RoomHeader } from './RoomHeader';
import { StoryPanel } from './StoryPanel';
import { VotingPanel } from './VotingPanel';

interface PlanningRoomProps {
  user: User;
  room: Room;
  onLeaveRoom: () => void;
}

export const PlanningRoom: React.FC<PlanningRoomProps> = ({ user, room, onLeaveRoom }) => {
  const [currentRoom, setCurrentRoom] = useState<Room>(room);
  const [currentVote, setCurrentVote] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [stories, setStories] = useState<Story[]>([]);

  // Efeito para se inscrever nos eventos do WebSocket
  useEffect(() => {
    const handleRoomUpdate = (updatedRoom: Room) => {
      setCurrentRoom(updatedRoom);
      // Atualiza a lista de histórias se necessário
      if (updatedRoom.currentStory && !stories.find(s => s.id === updatedRoom.currentStory!.id)) {
        setStories(prev => [...prev, updatedRoom.currentStory!]);
      }
    };

    const handleChatMessage = (message: ChatMessage) => {
      setChatMessages(prev => [...prev, message]);
    };

    addEventListener('room_update', handleRoomUpdate);
    addEventListener('chat_message', handleChatMessage);

    // Envia o evento de que o utilizador entrou na sala
    sendEvent({ type: 'join_room', payload: { user, room } });

    return () => {
      // Limpa os listeners quando o componente é desmontado
      removeEventListener('room_update', handleRoomUpdate);
      removeEventListener('chat_message', handleChatMessage);
    };
  }, [user, room]); // Executa apenas uma vez na montagem

  const allVoted = currentRoom.currentStory?.votes.length === currentRoom.participants.length;

  // As funções agora apenas enviam eventos para o backend.
  // O backend será responsável por atualizar o estado e notificar todos.

  const handleAddStory = (title: string, description?: string) => {
    sendEvent({ type: 'add_story', payload: { title, description } });
  };

  const handleVote = (value: string) => {
    setCurrentVote(value); // Mantém o estado local para feedback imediato na UI
    sendEvent({ type: 'vote', payload: { userId: user.id, value } });
  };

  const handleRevealVotes = () => {
    sendEvent({ type: 'reveal_votes' });
  };

  const handleStartNewVoting = () => {
    sendEvent({ type: 'add_story', payload: { title: "New Voting Round" } }); // Exemplo simplificado
  };

  const handleReEstimate = () => {
    sendEvent({ type: 're_estimate' });
  };

  const handleSendMessage = (message: string) => {
    sendEvent({ type: 'send_message', payload: { message } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <RoomHeader
        room={currentRoom}
        user={user}
        onLeaveRoom={onLeaveRoom}
      />

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <StoryPanel
              story={currentRoom.currentStory}
              isUserModerator={user.isModerator}
              votingActive={currentRoom.votingActive}
              onAddStory={handleAddStory}
              onStartNewVoting={handleStartNewVoting}
            />

            {currentRoom.currentStory && (
              <VotingPanel
                story={currentRoom.currentStory}
                currentVote={currentVote}
                votingActive={currentRoom.votingActive}
                votesRevealed={currentRoom.votesRevealed}
                allVoted={allVoted}
                isUserModerator={user.isModerator}
                onVote={handleVote}
                onRevealVotes={handleRevealVotes}
                onReEstimate={handleReEstimate}
              />
            )}

            {currentRoom.votesRevealed && currentRoom.currentStory && (
              <ResultsPanel
                story={currentRoom.currentStory}
                stories={stories}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <ParticipantsList
              participants={currentRoom.participants}
              currentStory={currentRoom.currentStory}
              votesRevealed={currentRoom.votesRevealed}
            />

            <Chat
              messages={chatMessages}
              currentUser={user}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};