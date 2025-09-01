import React from 'react';
import { Crown, User, Check, Clock } from 'lucide-react';
import { User as UserType, Story } from '../types';

interface ParticipantsListProps {
  participants: UserType[];
  currentStory?: Story;
  votesRevealed: boolean;
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({
  participants,
  currentStory,
  votesRevealed
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <User className="w-5 h-5 mr-2" />
        Participants ({participants.length}/15)
      </h3>
      
      <div className="space-y-2">
        {participants.map((participant) => {
          const userVote = currentStory?.votes.find(v => v.userId === participant.id);
          const hasVoted = Boolean(userVote);
          
          return (
            <div
              key={participant.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {participant.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{participant.name}</span>
                    {participant.isModerator && (
                      <Crown className="w-4 h-4 text-yellow-500" title="Moderator" />
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {currentStory && (
                  <>
                    {votesRevealed && userVote ? (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                        {userVote.value}
                      </span>
                    ) : hasVoted ? (
                      <Check className="w-5 h-5 text-green-500" title="Voted" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400" title="Waiting for vote" />
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {participants.length < 15 && (
        <p className="text-sm text-gray-500 mt-4 text-center">
          Room can accommodate {15 - participants.length} more participant{15 - participants.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};