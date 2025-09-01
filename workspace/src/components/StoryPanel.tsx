import React, { useState } from 'react';
import { Plus, Play, Square } from 'lucide-react';
import { Story } from '../types';

interface StoryPanelProps {
  story?: Story;
  isUserModerator: boolean;
  votingActive: boolean;
  onAddStory: (title: string, description?: string) => void;
  onStartNewVoting: () => void;
}

export const StoryPanel: React.FC<StoryPanelProps> = ({
  story,
  isUserModerator,
  votingActive,
  onAddStory,
  onStartNewVoting
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddStory(title.trim(), description.trim() || undefined);
    setTitle('');
    setDescription('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Current Story</h2>
        {isUserModerator && (
          <div className="flex space-x-2">
            {!votingActive && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Story</span>
              </button>
            )}
            {story && votingActive && (
              <button
                onClick={onStartNewVoting}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Square className="w-4 h-4" />
                <span>End Voting</span>
              </button>
            )}
          </div>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Story Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="As a user, I want to..."
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Additional details about the story..."
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Start Voting</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setTitle('');
                  setDescription('');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {story ? (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900">{story.title}</h3>
          {story.description && (
            <p className="text-gray-600">{story.description}</p>
          )}
          <div className="flex items-center space-x-4 text-sm">
            <span className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
              votingActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                votingActive ? 'bg-green-500' : 'bg-gray-500'
              }`} />
              <span>{votingActive ? 'Voting Active' : 'Voting Ended'}</span>
            </span>
            <span className="text-gray-500">
              {story.votes.length} vote{story.votes.length !== 1 ? 's' : ''} submitted
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {isUserModerator 
            ? "Add a story to start the estimation session"
            : "Waiting for the moderator to add a story..."
          }
        </div>
      )}
    </div>
  );
};