// planningpoker/workspace/src/services/socket.ts
import { ChatMessage, Room, User } from '../types';

let socket: WebSocket | null = null;

// Tipos de eventos que o frontend envia
type ClientEvent =
    | { type: 'join_room'; payload: { user: User; room: Room } }
    | { type: 'add_story'; payload: { title: string; description?: string } }
    | { type: 'vote'; payload: { userId: string; value: string } }
    | { type: 'reveal_votes' }
    | { type: 're_estimate' }
    | { type: 'send_message'; payload: { message: string } };

// Tipos de eventos que o frontend recebe
export interface ServerEventMap {
    'room_update': (room: Room) => void;
    'chat_message': (message: ChatMessage) => void;
}

const eventListeners: { [K in keyof ServerEventMap]?: ServerEventMap[K][] } = {};

export const connectWebSocket = (roomCode: string) => {
    if (socket) {
        socket.close();
    }

    // Conecta ao servidor Go.
    socket = new WebSocket(`ws://localhost:8080/ws?roomID=${roomCode}`);

    socket.onopen = () => {
        console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
        try {
            const parsed = JSON.parse(event.data);
            const { type, payload } = parsed;

            if (eventListeners[type as keyof ServerEventMap]) {
                eventListeners[type as keyof ServerEventMap]?.forEach(callback => callback(payload));
            }
        } catch (error) {
            console.error('Error parsing message from server:', error);
        }
    };

    socket.onclose = () => {
        console.log('WebSocket connection closed');
        socket = null;
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
};

export const sendEvent = (event: ClientEvent) => {
    if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(event));
    }
};

export const addEventListener = <K extends keyof ServerEventMap>(
    type: K,
    callback: ServerEventMap[K]
) => {
    if (!eventListeners[type]) {
        eventListeners[type] = [];
    }
    eventListeners[type]?.push(callback);
};

export const removeEventListener = <K extends keyof ServerEventMap>(
    type: K,
    callback: ServerEventMap[K]
) => {
    if (eventListeners[type]) {
        eventListeners[type] = eventListeners[type]?.filter(cb => cb !== callback);
    }
};

export const disconnectWebSocket = () => {
    if (socket) {
        socket.close();
        socket = null;
    }
};