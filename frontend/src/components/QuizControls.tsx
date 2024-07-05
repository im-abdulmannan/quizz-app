import { Socket } from "socket.io-client";

const QuizControls = ({socket, roomId}: {socket: Socket; roomId: string}) => {
  return (
    <div>Quiz Controls
        <button onClick={
            () => {
              socket.emit("next", {
                roomId
              });
            }
        }>Next Problem</button>
    </div>
  )
}

export default QuizControls