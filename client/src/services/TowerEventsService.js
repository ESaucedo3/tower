import {api} from './AxiosService.js';
import {TowerEvent} from '@/models/TowerEvent.js';
import {AppState} from '@/AppState.js';

class TowerEventsService {
  async createTowerEvent(towerEventData) {
    const response = await api.post('api/events', towerEventData);
    const createdTowerEvent = new TowerEvent(response.data);
    AppState.towerEvents.push(createdTowerEvent);
    return createdTowerEvent;
  }
  async getAllEvents() {
    const response = await api.get('api/events');
    const acquiredEvents = response.data.map((towerEvent) => new TowerEvent(towerEvent));
    AppState.towerEvents = acquiredEvents;
  }
  async getTowerEventById(eventId) {
    AppState.activeTowerEvent = null;
    const response = await api.get(`api/events/${eventId}`);
    const acquiredEvent = new TowerEvent(response.data);
    AppState.activeTowerEvent = acquiredEvent;
  }

  async updateTowerEvent(eventId, eventUpdateData) {
    const response = await api.put(`api/events/${eventId}`, eventUpdateData);
    const updatedEvent = new TowerEvent(response.data);
    AppState.activeTowerEvent = updatedEvent;
  }
  async cancelEvent(eventId) {
    const response = await api.delete(`api/events/${eventId}`);
    const cancelledEvent = new TowerEvent(response.data);
    AppState.activeTowerEvent = cancelledEvent;
  }
}

export const towerEventsService = new TowerEventsService();
