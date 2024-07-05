import { useState } from "react";
import { Socket } from "socket.io-client";

const CreateProblem = ({ socket, roomId }: { socket: Socket; roomId: string }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [answer, setAnswer] = useState(0)
  const [options, setOptions] = useState([
    {
      id: 0,
      title: "",
    },
    {
      id: 1,
      title: "",
    },
    {
      id: 2,
      title: "",
    },
    {
      id: 3,
      title: "",
    },
  ]);

  return (
    <div>
      Create Problem
      <br />
      Title:{" "}
      <input
        type="text"
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <br />
      Description:{" "}
      <input
        type="text"
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      />
      <br />
      {[0, 1, 2, 3].map((optionId) => (
        <div>
          <input checked={optionId === answer} type="radio" onChange={() => setAnswer(optionId)} />
          Option: {optionId}
          <input
            type="text"
            onChange={(e) => {
              setOptions((options) =>
                options.map((x) => {
                  if (x.id === optionId) {
                    return {
                      ...x,
                      title: e.target.value,
                    };
                  }
                  return x;
                })
              );
            }}
          />
          <br />
        </div>
      ))}
      <button
        onClick={() => {
          socket.emit("createProblem", {
            roomId,
            problem: {
              title,
              description,
              options,
              answer
            },
          });
        }}
      >Create Problem</button>
    </div>
  );
};

export default CreateProblem;
