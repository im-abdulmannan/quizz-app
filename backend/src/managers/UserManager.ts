import { Socket } from "socket.io";
import { QuizManager } from "./QuizManager";
const ADMIN_PASSWORD = "ADMIN_PASSWORD";

export class UserManager {
  private quizManager;

  constructor() {
    this.quizManager = new QuizManager();
  }

  addUser(socket: Socket) {
    this.createHandlers(socket);
  }

  private createHandlers(socket: Socket) {
    socket.on("join", (data) => {
      const userId = this.quizManager.addUser(data.roomId, data.name);
      socket.emit("init", {
        userId,
        state: this.quizManager.getCurrentState(data.roomId),
      });
    });

    socket.on("joinAdmin", (data) => {
      // const userId = this.quizManager.addUser(data.roomId, data.name);
      if (data.password != ADMIN_PASSWORD) {
        return;
      }
      console.log("join admin called");
      // socket.emit("admin_init", {
      //   userId,
      //   state: this.quizManager.getCurrentState(data.roomId),
      // });

      socket.on("createQuiz", (data) => {
        console.log("Create quiz called");
        this.quizManager.addQuiz(data.roomId);
      });

      socket.on("createProblem", (data) => {
        console.log("Create problem called");
        this.quizManager.addProblem(data.roomId, data.problem);
      });

      socket.on("next", (data) => {
        console.log("Go to the next problem");
        this.quizManager.next(data.roomId);
      });
    });

    socket.on("submission", (data) => {
      const userId = data.userId;
      const problemId = data.problemId;
      const submission = data.submission;
      const roomId = data.submission;
      if (
        submission != 0 ||
        submission != 1 ||
        submission != 2 ||
        submission != 3
      ) {
        console.log("Invalid submission!!! " + submission);
        return;
      }

      this.quizManager.submit(userId, roomId, problemId, submission);
    });
  }
}
