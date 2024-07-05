import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import CurrentQuestion from "./CurrentQuestion";
import LeaderBoard from "./LeaderBoard";

const User = () => {
  const searchParams = new URLSearchParams(document.location.search);
  const roomId=searchParams.get('roomId');
  const [name, setName] = useState("")
  const [submitted, setSubmitted] = useState(false)

  if(!submitted) {
    return (
      <div>
        Name - <input type="text" placeholder="name" required onChange={(e) => {
          setName(e.target.value)
        }} />
<br />
        <button onClick={() => {
          setSubmitted(true)
        }}>Submit</button>
      </div>
    )
  }

  return <UserLoggedin name={name} />
}

const UserLoggedin = ({name} : {name: string;}) => {

  const [socket, setSocket] = useState<null | any>(null)
  const [currentState, setCurrentState] = useState("not_started")
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [userId, setUserId] = useState("")


  const searchParams = new URLSearchParams(document.location.search);
  const roomId = searchParams.get('roomId');

  useEffect(() => {
    const socket = io("http://localhost:3000");
    setSocket(socket);
    socket.on("connect", () => {
      console.log(socket.id);
      socket.emit("join", {
        roomId,
        name
      });
    });

    socket.on("init", ({userId, state}) => {
      setUserId(userId);


      if(state.leaderboard) {
        setLeaderboard(state.leaderboard);
      } 


      if(state.problem) {
        setCurrentQuestion(state.problem);
      }


      setCurrentState(state.type);
    })

    socket.on("leaderboard", (data) => {
      setCurrentState("leaderboard");
      setLeaderboard(data.leaderboard);
    })

    socket.on("problem", (data) => {
      setCurrentState("question");
      setCurrentQuestion(data.problem);
    })

  }, [roomId]);


if(currentState === "not_started") {
  return (<div>
    This quiz is not started
  </div>)
}

if(currentState === "question")
  {
    return <CurrentQuestion question={currentQuestion} />;
  }


  if(currentState === "leaderboard")
    {
      return <LeaderBoard leaderboard={leaderboard} />;
    }


  return (
    <div>Quiz has ended</div>
  )
}

export default User