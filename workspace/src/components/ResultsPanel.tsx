import React from 'react';
import { Download, BarChart3 } from 'lucide-react';
import { Story } from '../types';
import { calculateVoteStatistics, exportToCSV } from '../utils/statistics';

interface ResultsPanelProps {
  story: Story;
  stories: Story[];
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ story, stories }) => {
  const stats = calculateVoteStatistics(story.votes);

  const handleExportCSV = () => {
    exportToCSV(stories);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Voting Results
        </h3>
        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Statistics */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Quick Stats</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Average:</span>
              <span className="font-medium">{stats.average}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mode:</span>
              <span className="font-medium">{stats.mode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Votes:</span>
              <span className="font-medium">{stats.totalVotes}</span>
            </div>
          </div>
        </div>

        {/* Vote Distribution */}
        <div className="md:col-span-2 space-y-4">
          <h4 className="font-medium text-gray-900">Vote Distribution</h4>
          <div className="space-y-2">
            {stats.distribution.map(({ value, count, percentage }) => (
              <div key={value} className="flex items-center space-x-3">
                <span className="w-8 text-center font-medium">{value}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 flex items-center justify-end pr-2 text-white text-xs font-medium transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  >
                    {percentage > 15 && `${count} votes`}
                  </div>
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">
                  {percentage.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Individual Votes */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Individual Votes</h4>
        <div className="flex flex-wrap gap-2">
          {story.votes.map((vote) => (
            <span
              key={vote.userId}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {vote.userName}: {vote.value}
            </span>
          ))}
        </div>
      </div>

      {stats.consensus && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-center font-medium">
            🎉 Consensus reached! Most voted: {stats.consensus}
          </p>
        </div>
      )}
    </div>
  );
};