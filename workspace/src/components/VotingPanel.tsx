import React from 'react';
import { Eye, RotateCcw } from 'lucide-react';
import { Story, POKER_DECK } from '../types';

interface VotingPanelProps {
  story: Story;
  currentVote: string;
  votingActive: boolean;
  votesRevealed: boolean;
  allVoted: boolean;
  isUserModerator: boolean;
  onVote: (value: string) => void;
  onRevealVotes: () => void;
  onReEstimate: () => void;
}

export const VotingPanel: React.FC<VotingPanelProps> = ({
  story,
  currentVote,
  votingActive,
  votesRevealed,
  allVoted,
  isUserModerator,
  onVote,
  onRevealVotes,
  onReEstimate
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Cast Your Vote</h3>
        {isUserModerator && votingActive && !votesRevealed && (
          <button
            onClick={onRevealVotes}
            disabled={story.votes.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Reveal Votes</span>
          </button>
        )}
        {isUserModerator && votesRevealed && (
          <button
            onClick={onReEstimate}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Re-estimate</span>
          </button>
        )}
      </div>

      {votingActive && !votesRevealed ? (
        <div>
          <p className="text-gray-600 mb-4">
            Select your estimate for this story. Your vote will remain hidden until revealed.
          </p>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
            {POKER_DECK.map((value) => (
              <button
                key={value}
                onClick={() => onVote(value)}
                className={`aspect-[3/4] flex items-center justify-center text-lg font-bold rounded-xl border-2 transition-all hover:scale-105 ${
                  currentVote === value
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:shadow-sm'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          {currentVote && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-center">
                ✓ You voted: <span className="font-bold">{currentVote}</span>
              </p>
            </div>
          )}
        </div>
      ) : votesRevealed ? (
        <div>
          <p className="text-gray-600 mb-4">Votes have been revealed!</p>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
            {POKER_DECK.map((value) => {
              const voteCount = story.votes.filter(v => v.value === value).length;
              const hasVotes = voteCount > 0;
              return (
                <div
                  key={value}
                  className={`aspect-[3/4] flex flex-col items-center justify-center text-lg font-bold rounded-xl border-2 ${
                    hasVotes
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-gray-50 text-gray-400'
                  }`}
                >
                  <span>{value}</span>
                  {hasVotes && (
                    <span className="text-xs mt-1 bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                      {voteCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Voting has ended for this story.
        </div>
      )}

      {votingActive && !votesRevealed && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>{story.votes.length} of {story.votes.length} participants have voted</span>
          {allVoted && (
            <span className="text-green-600 font-medium">All participants have voted!</span>
          )}
        </div>
      )}
    </div>
  );
};