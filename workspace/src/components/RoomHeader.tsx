import React, { useState } from 'react';
import { LogOut, Copy, Check, Share2 } from 'lucide-react';
import { Room, User } from '../types';

interface RoomHeaderProps {
  room: Room;
  user: User;
  onLeaveRoom: () => void;
}

export const RoomHeader: React.FC<RoomHeaderProps> = ({ room, user, onLeaveRoom }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(room.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy room code:', err);
    }
  };

  const handleShareRoom = async () => {
    const shareUrl = `${window.location.origin}?room=${room.code}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join Planning Poker Room: ${room.name}`,
          text: `Join our planning session using room code: ${room.code}`,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{room.name}</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Room Code:</span>
                <code className="bg-gray-100 px-2 py-1 rounded font-mono">{room.code}</code>
                <button
                  onClick={handleCopyRoomCode}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Copy room code"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">
              Welcome, <span className="font-medium">{user.name}</span>
              {user.isModerator && <span className="ml-1 text-blue-600 font-medium">(Moderator)</span>}
            </span>
            
            <button
              onClick={handleShareRoom}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={onLeaveRoom}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Leave</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};