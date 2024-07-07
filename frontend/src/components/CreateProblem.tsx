import { useState } from "react";
import { Socket } from "socket.io-client";

const CreateProblem = ({
  socket,
  roomId,
}: {
  socket: Socket;
  roomId: string;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [answer, setAnswer] = useState(0);
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
    <div className="bg-gray-100 flex flex-col mt-10">
      <h1 className="text-2xl font-semibold text-slate-600 drop-shadow-md text-center mb-10">
        Create Problem
      </h1>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-600">Title:</h2>
          <input
            className="text-xl text-slate-600 font-medium w-64 p-2 border-2 border-purple-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-800"
            type="text"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <br />
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-600">Description:</h2>
          <input
            className="text-xl text-slate-600 font-medium w-64 p-2 border-2 border-purple-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-800"
            type="text"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </div>
        {[0, 1, 2, 3].map((optionId) => (
          <div className="flex flex-row items-center justify-between">
            <label className="cursor-pointer text-lg text-slate-600 font-medium flex items-center">
              <input
                checked={optionId === answer}
                className="h-5 w-5 mx-3"
                type="radio"
                onChange={() => setAnswer(optionId)}
              />
              <p>Option: {optionId + 1}</p>
            </label>
            <input
              className="text-lg w-64 p-2 border-2 text-slate-600 border-purple-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-800"
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
          </div>
        ))}
        <div className="flex justify-end">
          <button
            className="bg-purple-600 text-white w-64 py-2 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-opacity-50"
            onClick={() => {
              socket.emit("createProblem", {
                roomId,
                problem: {
                  title,
                  description,
                  options,
                  answer,
                },
              });
            }}
          >
            Create Problem
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProblem;
