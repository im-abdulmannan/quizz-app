interface Leaderboard {
  users: [];
}

const LeaderBoard = ({ leaderboard }: { leaderboard: Leaderboard }) => {
  return <div>{JSON.stringify(leaderboard)}</div>;
};

export default LeaderBoard;
