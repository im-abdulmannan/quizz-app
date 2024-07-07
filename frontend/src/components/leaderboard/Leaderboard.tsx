import Card from "./Card";

export function LeaderBoard({leaderboardData}: {
    leaderboardData: {
        points: number;
        username: string,
        profilePicture?: string
    }
}) {

    return (
        <div className="bg-gray-100 h-screen">
            <h1 className="text-2xl font-semibold text-center text-slate-600 drop-shadow-lg py-10">
                Leaderboard Results 🚀
            </h1>
            <div className="w-[60%] mx-auto px-12">
                    {leaderboardData.map((el, index) => (
                        <div className=" flex justify-center">
                            <Card
                                sno={index + 1}
                                name={el.username}
                                points={el.points}
                                image={el.profilePicture}
                            />
                        </div>
                    ))}
            </div>
        </div>
    );
}
