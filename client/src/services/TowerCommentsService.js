import { ProfileComment } from "@/models/TowerComment.js";
import { api } from "./AxiosService.js";
import { AppState } from "@/AppState.js";
import { logger } from "@/utils/Logger.js";

class TowerCommentsService {
  async deleteComment(commentId) {
    const response = await api.delete(`api/comments/${commentId}`);
    logger.log(response.data);
    const commentIndex = AppState.profileComments.findIndex(
      (eventComment) => eventComment.id === commentId
    );
    AppState.profileComments.splice(commentIndex, 1);
  }
  async getProfileComments(eventId) {
    const response = await api.get(`api/events/${eventId}/comments`);
    const acquiredComments = response.data.map(
      (eventComment) => new ProfileComment(eventComment)
    );
    AppState.profileComments = acquiredComments;
  }
  async createComment(commentData) {
    const response = await api.post("api/comments", commentData);
    const newComment = new ProfileComment(response.data);
    AppState.profileComments.push(newComment);
  }
}

export const towerCommentsService = new TowerCommentsService();
