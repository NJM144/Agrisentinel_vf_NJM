import CryptoJS from 'crypto-js';

export interface LotEvent {
  id: string;
  lotId: string;
  type: 'RECOLTE' | 'RECEPTION_COOP' | 'CERTIFICATION_VALIDEE' | 'CERTIFICATION_REFUSEE';
  timestamp: string;
  actorUid: string;
  data?: Record<string, unknown>;
  prevHash?: string;
  hash?: string;
}

// Generate hash for an event
export const generateEventHash = (event: Omit<LotEvent, 'hash'>, prevHash: string = ''): string => {
  // Create a clean object with sorted keys for consistent hashing
  const eventData = {
    id: event.id,
    lotId: event.lotId,
    type: event.type,
    timestamp: event.timestamp,
    actorUid: event.actorUid,
    data: event.data || {},
    prevHash
  };
  
  // Sort keys to ensure consistent hash generation
  const sortedKeys = Object.keys(eventData).sort();
  const sortedData: Record<string, unknown> = {};
  sortedKeys.forEach(key => {
    sortedData[key] = eventData[key as keyof typeof eventData];
  });
  
  const jsonString = JSON.stringify(sortedData);
  return CryptoJS.SHA256(jsonString).toString();
};

// Validate hash chain integrity
export const validateHashChain = (events: LotEvent[]): boolean => {
  if (events.length === 0) return true;
  
  // Sort events by timestamp
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  for (let i = 0; i < sortedEvents.length; i++) {
    const event = sortedEvents[i];
    const prevHash = i === 0 ? '' : sortedEvents[i - 1].hash || '';
    
    const expectedHash = generateEventHash({
      id: event.id,
      lotId: event.lotId,
      type: event.type,
      timestamp: event.timestamp,
      actorUid: event.actorUid,
      data: event.data,
      prevHash: event.prevHash
    }, prevHash);
    
    if (event.hash !== expectedHash) {
      return false;
    }
  }
  
  return true;
};

// Create a new event in the chain
export const createChainEvent = (
  eventData: Omit<LotEvent, 'hash' | 'prevHash'>,
  previousHash: string = ''
): LotEvent => {
  const event: Omit<LotEvent, 'hash'> = {
    ...eventData,
    prevHash: previousHash
  };
  
  const hash = generateEventHash(event, previousHash);
  
  return {
    ...event,
    hash
  };
};