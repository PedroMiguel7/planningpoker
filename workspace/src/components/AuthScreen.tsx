import React, { useState } from 'react';
import { Users, Play, Plus } from 'lucide-react';
import { User, Room } from '../types';
import { generateRoomCode, generateUserId } from '../utils/helpers';

interface AuthScreenProps {
  onJoinRoom: (user: User, room: Room) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onJoinRoom }) => {
  const [userName, setUserName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [roomName, setRoomName] = useState('');

  const handleCreateRoom = () => {
    if (!userName.trim() || !roomName.trim()) return;

    const userId = generateUserId();
    const newRoomCode = generateRoomCode();

    const user: User = {
      id: userId,
      name: userName.trim(),
      isModerator: true
    };

    const room: Room = {
      id: userId,
      code: newRoomCode,
      name: roomName.trim(),
      participants: [user],
      votingActive: false,
      votesRevealed: false
    };

    onJoinRoom(user, room);
  };

  const handleJoinRoom = () => {
    if (!userName.trim() || !roomCode.trim()) return;

    const userId = generateUserId();

    const user: User = {
      id: userId,
      name: userName.trim(),
      isModerator: false
    };

    const room: Room = {
      id: roomCode,
      code: roomCode.toUpperCase(),
      name: 'Planning Session',
      participants: [user],
      votingActive: false,
      votesRevealed: false
    };

    onJoinRoom(user, room);
  };


  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Planning Poker</h1>
          
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your name"
              maxLength={50}
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setIsCreating(true)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${isCreating
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Create Room
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${!isCreating
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <Play className="w-4 h-4 inline mr-2" />
              Join Room
            </button>
          </div>

          {isCreating ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-2">
                  Room Name
                </label>
                <input
                  type="text"
                  id="roomName"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Sprint Planning Session"
                  maxLength={100}
                />
              </div>
              <button
                onClick={handleCreateRoom}
                disabled={!userName.trim() || !roomName.trim()}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Create Room
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="roomCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Room Code
                </label>
                <input
                  type="text"
                  id="roomCode"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors uppercase tracking-wider text-center text-lg font-mono"
                  placeholder="ABC123"
                  maxLength={6}
                />
              </div>
              <button
                onClick={handleJoinRoom}
                disabled={!userName.trim() || !roomCode.trim()}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Join Room
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          
        </div>
      </div>
    </div>
  );
};