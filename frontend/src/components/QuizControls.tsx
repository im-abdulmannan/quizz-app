import { Socket } from "socket.io-client";

const QuizControls = ({
  socket,
  roomId,
}: {
  socket: Socket;
  roomId: string;
}) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-slate-600">Quiz Controls</h2>
      <button
          className="bg-purple-600 text-white w-64 py-2 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-opacity-50"
        onClick={() => {
          socket.emit("next", {
            roomId,
          });
        }}
      >
        Next Problem
      </button>
    </div>
  );
};

export default QuizControls;
