import { Auth0Provider } from "@bcwdev/auth0provider";
import BaseController from "../utils/BaseController.js";
import { towerCommentsService } from "../services/TowerCommentsService.js";

export class TowerCommentsController extends BaseController {
  constructor() {
    super("api/comments");
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post("", this.createComment)
      .delete("/:commentId", this.deleteComment);
  }

  async createComment(request, response, next) {
    try {
      const commentData = request.body;
      commentData.creatorId = request.userInfo.id;
      const createdComment = await towerCommentsService.createComment(
        commentData
      );
      response.send(createdComment);
    } catch (e) {
      next(e);
    }
  }

  async deleteComment(request, response, next) {
    try {
      const commentId = request.params.commentId;
      const userId = request.userInfo.id;
      const deletedMsg = await towerCommentsService.deleteComment(
        userId,
        commentId
      );
      response.send(deletedMsg);
    } catch (e) {
      next(e);
    }
  }
}
