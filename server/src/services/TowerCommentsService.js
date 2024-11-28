import { dbContext } from "../db/DbContext.js";
import { Forbidden } from "../utils/Errors.js";

class TowerCommentsService {
  async getEventComments(eventId) {
    const eventComments = await dbContext.TowerComments.find({
      eventId: eventId,
    }).populate("creator");
    return eventComments;
  }
  async createComment(commentData) {
    const comment = await dbContext.TowerComments.create(commentData);
    await comment.populate("creator", "-email");
    return comment;
  }
  async deleteComment(userId, commentId) {
    const commentToDelete = await dbContext.TowerComments.findById(commentId);
    if (!commentToDelete)
      throw new Error(`There is no comment with an id of ${commentToDelete}`);
    if (commentToDelete.creatorId != userId)
      throw new Forbidden("You cannot remove a comment that isn't yours");
    await commentToDelete.deleteOne();
    return "Comment successfully removed";
  }
}

export const towerCommentsService = new TowerCommentsService();
