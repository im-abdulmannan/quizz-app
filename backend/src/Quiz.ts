import { IoManager } from "./managers/IoManager";

export type AllowSubmissions = 0 | 1 | 2 | 3;
const PROBLEM_TIME_SECONDS = 20;

interface User {
  name: string;
  id: string;
  points: number;
}

interface Submission {
  problemId: string;
  userId: string;
  isCorrect: boolean;
  optionSelected: AllowSubmissions;
}

interface Problem {
  id: string;
  title: string;
  description: string;
  image?: string;
  startTime: number;
  answer: AllowSubmissions;
  options: {
    id: number;
    title: string;
  }[];
  submissions: Submission[];
}

export class Quiz {
  public roomId: string;
  private hasStarted: boolean;
  private problems: Problem[];
  private activeProblem: number;
  private users: User[];
  private currentState: "leaderboard" | "question" | "not_started" | "ended";

  constructor(roomId: string) {
    this.roomId = roomId;
    this.hasStarted = false;
    this.activeProblem = 0;
    this.problems = [];
    this.users = [];
    this.currentState = "not_started";
    setInterval(() => {
      this.debug();
    }, 10000);
  }

  debug() {
    console.log("---debug---");
    console.log(this.roomId);
    console.log(JSON.stringify(this.problems));
    console.log(this.users);
    console.log(this.currentState)
    console.log(this.activeProblem)
  }

  addProblem(problem: Problem) {
    this.problems.push(problem);
    console.log(this.problems);
  }

  start() {
    this.hasStarted = true;
    this.setActiveProblem(this.problems[0]);
  }

  setActiveProblem(problem: Problem) {
    console.log("set active problem")
    this.currentState = "question";
    problem.startTime = new Date().getTime();
    problem.submissions = [];

    IoManager.getIo().emit("CHANGE_PROBLEM", {
      problem,
    });

    setTimeout(() => {
      this.sendLeaderBoard();
    }, PROBLEM_TIME_SECONDS * 1000);
  }

  sendLeaderBoard() {
    console.log("send: leaderboard")
    this.currentState = "leaderboard";
    const leaderBoard = this.getLeaderBoard();
    IoManager.getIo().to(this.roomId).emit("leaderBoard", {
      leaderBoard: leaderBoard,
    });
  }

  next() {
    this.activeProblem++;
    const problem = this.problems[this.activeProblem];
    if (problem) {
      problem.startTime = new Date().getTime();
      this.setActiveProblem(problem);
    } else {
      //   IoManager.getIo().emit("QUIZ_END", { problem });
    }
  }

  getRandomString(length: number) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()";
    var charLength = chars.length;
    var result = "";

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * charLength));
    }

    return result;
  }

  addUser(name: string) {
    const userId = this.getRandomString(10);
    this.users.push({
      id: userId,
      name: name,
      points: 0,
    });

    return userId;
  }

  submit(
    userId: string,
    roomId: string,
    problemId: string,
    submission: AllowSubmissions
  ) {
    const problem = this.problems.find((p) => p.id === problemId);
    const user = this.users.find((u) => u.id === userId);
    if (!problem || !user) {
      return;
    }

    const existingSubmission = problem.submissions.find(
      (s) => s.userId === userId
    );

    if (existingSubmission) {
      return;
    }

    problem.submissions.push({
      problemId,
      userId,
      isCorrect: problem.answer === submission,
      optionSelected: submission,
    });

    user.points +=
      1000 -
      (500 * (new Date().getTime() - problem.startTime)) / PROBLEM_TIME_SECONDS;
  }

  getLeaderBoard() {
    return this.users
      .sort((a, b) => (a.points < b.points ? 1 : -1))
      .slice(0, 20);
  }

  getCurrentState() {
    if (this.currentState === "not_started") {
      return {
        type: "not_started",
      };
    }

    if (this.currentState === "ended") {
      return {
        type: "ended",
        leaderBoard: this.getLeaderBoard(),
      };
    }

    if (this.currentState === "leaderboard") {
      return {
        type: "leaderboard",
        leaderBoard: this.getLeaderBoard(),
      };
    }

    if (this.currentState === "question") {
      const problem = this.problems[this.activeProblem];
      return {
        type: "question",
        problem,
      };
    }
  }
}
