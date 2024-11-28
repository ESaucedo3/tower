import { Profile } from "./Profile.js";

export class TowerComment {
  constructor(data) {
    this.id = data.id;
    this.creatorId = data.creatorId;
    this.eventId = data.eventId;
    this.body = data.body;
  }
}

export class ProfileComment extends TowerComment {
  constructor(data) {
    super(data);
    this.creator = new Profile(data.creator);
  }
}
