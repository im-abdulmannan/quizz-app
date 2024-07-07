import { Dispatch, SetStateAction, useState } from "react";
import { Socket } from "socket.io-client";

export function Quiz({
  roomTitle,
  quizData,
  socket,
  userId,
  problemId,
  roomId,
}: {
  roomTitle: string;
  quizData: {
    title: string;
    options: string[];
  };
  socket: Socket | null;
  roomId: string;
  userId: string;
  problemId: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submission, setSubmission] = useState(0);

  return (
    // <div className="h-screen">
    <div className="bg-gray-100 h-screen flex justify-center">
      <div className="flex w-[50%] justify-center mt-10">
        <div className="w-96">
          <SingleQuiz
            roomTitle={roomTitle}
            choices={quizData.options.map((option) => option.title)}
            title={quizData.title}
            imageURL={""}
            setSelected={setSubmission}
          />
          <div className="flex justify-between w-full mt-4 text-white">
            <button
              className="bg-purple-600 w-full text-white py-2 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-opacity-50"
              disabled={submitted}
              onClick={() => {
                setSubmitted(true);
                socket?.emit("submission", {
                  userId,
                  problemId,
                  submission: Number(submission),
                  roomId,
                });
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type SingleQuizProps = {
  roomTitle: string;
  title: string;
  choices: string[];
  imageURL?: string;
  setSelected: Dispatch<SetStateAction<number>>;
};
function SingleQuiz({
  roomTitle,
  title,
  choices,
  imageURL,
  setSelected,
}: SingleQuizProps) {
  return (
    <article>
      <h1 className="text-2xl font-semibold mb-2 text-slate-600 text-center drop-shadow-md">
        {roomTitle}
      </h1>
      <br />
      <div className="text-xl font-medium mb-2 text-slate-600">{title}</div>
      <br />
      {imageURL && <img src={imageURL} alt="" />}
      {choices.length &&
        choices.map((choice, index) => {
          return (
            <label className="flex flex-col gap-2">
              <div
                key={index}
                className="flex items-center w-full py-4 pl-5 m-2 ml-0 space-x-2 border-2 cursor-pointer border-purple-600 rounded-xl"
              >
                <input
                  type="radio"
                  name="option"
                  value={choice}
                  className="w-6 h-6 bg-black"
                  onClick={() => {
                    setSelected(index);
                  }}
                />
                <p className="ml-6 ">{choice}</p>
              </div>
            </label>
          );
        })}
    </article>
  );
}
