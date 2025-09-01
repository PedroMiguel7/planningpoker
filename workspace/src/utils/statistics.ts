import { Vote, Story } from '../types';

export interface VoteStatistics {
  average: string;
  mode: string;
  totalVotes: number;
  distribution: Array<{
    value: string;
    count: number;
    percentage: number;
  }>;
  consensus?: string;
}

export const calculateVoteStatistics = (votes: Vote[]): VoteStatistics => {
  if (votes.length === 0) {
    return {
      average: 'N/A',
      mode: 'N/A',
      totalVotes: 0,
      distribution: []
    };
  }

  // Filter out non-numeric votes for average calculation
  const numericVotes = votes
    .map(v => parseFloat(v.value))
    .filter(v => !isNaN(v));

  // Calculate average
  const average = numericVotes.length > 0
    ? (numericVotes.reduce((sum, val) => sum + val, 0) / numericVotes.length).toFixed(1)
    : 'N/A';

  // Calculate vote distribution
  const valueCount = new Map<string, number>();
  votes.forEach(vote => {
    valueCount.set(vote.value, (valueCount.get(vote.value) || 0) + 1);
  });

  const distribution = Array.from(valueCount.entries())
    .map(([value, count]) => ({
      value,
      count,
      percentage: (count / votes.length) * 100
    }))
    .sort((a, b) => b.count - a.count);

  // Find mode (most frequent vote)
  const mode = distribution.length > 0 ? distribution[0].value : 'N/A';

  // Check for consensus (>60% agreement)
  const consensus = distribution.length > 0 && distribution[0].percentage >= 60
    ? distribution[0].value
    : undefined;

  return {
    average,
    mode,
    totalVotes: votes.length,
    distribution,
    consensus
  };
};

export const exportToCSV = (stories: Story[]): void => {
  const headers = ['Story Title', 'Description', 'Votes', 'Average', 'Mode', 'Final Estimate'];
  const rows = stories.map(story => {
    const stats = calculateVoteStatistics(story.votes);
    return [
      `"${story.title}"`,
      `"${story.description || ''}"`,
      story.votes.map(v => `${v.userName}:${v.value}`).join('; '),
      stats.average,
      stats.mode,
      story.finalEstimate || ''
    ];
  });

  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `planning-poker-results-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};