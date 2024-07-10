import { ChangeEvent, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import CreateProblem from "./CreateProblem";
import QuizControls from "./QuizControls";

const Admin = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [quizId, setQuizId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const socket = io("https://quiz-app-backend-ecru.vercel.app/");
    setSocket(socket);
    socket.on("connect", () => {
      console.log(socket.id);
      socket.emit("joinAdmin", {
        password: "ADMIN_PASSWORD",
      });
    });
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRoomId(value);
    setIsValid(value.length >= 4 && value.length <= 4);
  };

  const handleSubmit = () => {
    if (!isValid) {
      return alert("Invalid room ID!");
    }
    socket?.emit("createQuiz", {
      roomId,
    });
    setQuizId(roomId);
  };

  if (!quizId) {
    return (
      <div className="bg-gray-100 h-screen w-full flex items-center justify-center">
        <div className="bg-[white] flex flex-col items-center gap-5 py-8 px-12 rounded-xl shadow-lg shadow-[#00000018]">
          <h1 className="text-2xl font-semibold text-slate-600 drop-shadow-md">
            Create Room
          </h1>
          <input
            placeholder="****"
            className="text-center w-64 p-2 border-2 border-purple-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-800"
            type="text"
            onChange={handleChange}
          />
          <button
            className="bg-purple-600 text-white w-64 py-2 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-opacity-50"
            onClick={handleSubmit}
          >
            Create Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 h-screen flex w-full">
    <div className="w-[50%] mx-auto px-20">
      <CreateProblem roomId={quizId} socket={socket} />
      <br />
      <br />
      <QuizControls socket={socket} roomId={quizId} />
    </div>
    </div>
  );
};

export default Admin;
