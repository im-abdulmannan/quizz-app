import { FaRegUser } from "react-icons/fa";

type props = {
  sno: number;
  name: string;
  points: number;
  image?: string;
};

function Card({ sno, name, points, image }: props) {
  return (
    <div className="flex font-medium border border-purple-600 text-slate-600 rounded-lg justify-between items-center w-full bg-white mb-4 px-10 shadow-sm shadow-[#80008053]">
      <div className="flex gap-4 my-5 w-5/12">
        <p>{sno}.</p>
        <h3>{name}</h3>
      </div>
      <div>
        <p>{points}</p>
      </div>
      <div>
        <div className="bg-white p-1 rounded-full">
          {image ? (
            <img src={image} alt={image} className="w-8 rounded-full" />
          ) : (
            <FaRegUser className="text-black text-3xl" />
          )}
        </div>
      </div>
    </div>
  );
}

export default Card;
