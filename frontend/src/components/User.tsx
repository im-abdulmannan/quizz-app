import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { LeaderBoard } from "./leaderboard/Leaderboard";
import { Quiz } from "./Quiz";

const User = () => {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [code, setCode] = useState("");

  if (!submitted) {
    return (
      <div>
        <div className="bg-gray-100 flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold mb-2 text-slate-600">
                Enter the code to join
              </h1>
            </div>
            <div className="mb-8">
              <input
                className="text-center font-medium text-slate-600 w-64 p-2 border-2 border-purple-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-800"
                placeholder="****"
                style={{ fontSize: "1rem" }}
                type="text"
                onChange={(e) => {
                  setCode(e.target.value);
                }}
              />
              <br /> <br />
              <input
                className="text-center font-medium text-slate-600 w-64 p-2 border-2 border-purple-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-800"
                placeholder="John Doe"
                style={{ fontSize: "1rem" }}
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <button
              className="bg-purple-600 text-white w-64 py-2 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-opacity-50"
              style={{ fontSize: "1rem" }}
              onClick={() => {
                setSubmitted(true);
              }}
            >
              Join
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <UserLoggedin code={code} name={name} />;
};

type Option = {
  title: string;
  options: [];
};

interface QuizQuestion {
  id: string;
  description: string;
  options: Option[];
  title: string;
}

interface LeaderboardItem {
  points: number;
  name: string;
  image?: string;
}

const UserLoggedin = ({ code, name }: { name: string; code: string }) => {
  const socketRef = useRef<Socket | null>(null);
  const [currentState, setCurrentState] = useState("not_started");
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>();
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [userId, setUserId] = useState("");
  const roomId = code;

  useEffect(() => {
    const socket = io("https://quiz-app-backend-ecru.vercel.app/");
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log(socket.id);
      socket.emit("join", {
        roomId,
        name,
      });
    });

    socket.on("init", ({ userId, state }) => {
      setUserId(userId);
      if (state.leaderboard) {
        setLeaderboard(state.leaderboard);
      }
      if (state.problem) {
        setCurrentQuestion(state.problem);
      }
      setCurrentState(state.type);
    });

    socket.on("leaderboard", (data) => {
      setCurrentState("leaderboard");
      setLeaderboard(data.leaderboard);
    });

    socket.on("problem", (data) => {
      setCurrentState("question");
      setCurrentQuestion(data.problem);
    });

    return () => {
      socket.off("connect");
      socket.off("init");
      socket.off("leaderboard");
      socket.off("problem");
      socket.disconnect();
    };
  }, [roomId, name]);

  if (currentState === "not_started") {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-2xl text-slate-600">
          Hey, <span className="font-medium">{name}</span>
          <br />
          Please wait for the host to start the quiz...
        </p>
      </div>
    );
  }

  if (currentState === "question" && currentQuestion) {
    return (
      <Quiz
        roomTitle={currentQuestion.title}
        roomId={roomId}
        userId={userId}
        problemId={currentQuestion.id}
        quizData={{
          title: currentQuestion.description,
          options: currentQuestion.options,
        }}
        socket={socketRef.current}
      />
    );
  }

  if (currentState === "leaderboard") {
    return (
      <LeaderBoard
        leaderboardData={leaderboard.map((item) => ({
          points: item.points,
          username: item.name,
          image: item.image,
        }))}
      />
    );
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-2xl text-slate-600">
        Hey, <span className="font-medium">{name}</span>
        <br />
        Thanks for joining us, the quiz has been ended
      </p>
    </div>
  );
};

export default User;
