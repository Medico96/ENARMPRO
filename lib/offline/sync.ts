import { createClient } from '@/lib/supabase/client';

interface QueuedAction {
  id: string;
  type: 'simulador_respuesta' | 'flashcard_progress' | 'study_session';
  data: any;
  timestamp: number;
}

const QUEUE_KEY = 'enarm_pro_offline_queue';

export class OfflineSync {
  private queue: QueuedAction[] = [];
  private syncing: boolean = false;

  constructor() {
    this.loadQueue();
    this.setupOnlineListener();
  }

  private loadQueue() {
    if (typeof window === 'undefined') return;
    
    const stored = localStorage.getItem(QUEUE_KEY);
    if (stored) {
      this.queue = JSON.parse(stored);
    }
  }

  private saveQueue() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(QUEUE_KEY, JSON.stringify(this.queue));
  }

  private setupOnlineListener() {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      console.log('Connection restored. Syncing...');
      this.syncQueue();
    });
  }

  addToQueue(type: QueuedAction['type'], data: any) {
    const action: QueuedAction = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      data,
      timestamp: Date.now(),
    };

    this.queue.push(action);
    this.saveQueue();

    // Intentar sincronizar inmediatamente si hay conexión
    if (navigator.onLine) {
      this.syncQueue();
    }
  }

  async syncQueue() {
    if (this.syncing || this.queue.length === 0) return;

    this.syncing = true;
    const supabase = createClient();

    const failedActions: QueuedAction[] = [];

    for (const action of this.queue) {
      try {
        switch (action.type) {
          case 'simulador_respuesta':
            await supabase.from('simulador_respuestas').insert(action.data);
            break;

          case 'flashcard_progress':
            await supabase
              .from('flashcard_progress')
              .upsert(action.data, { onConflict: 'user_id,flashcard_id' });
            break;

          case 'study_session':
            await supabase.from('study_sessions').insert(action.data);
            break;
        }

        console.log(`Synced action ${action.id}`);
      } catch (error) {
        console.error(`Failed to sync action ${action.id}:`, error);
        failedActions.push(action);
      }
    }

    // Actualizar cola solo con las acciones fallidas
    this.queue = failedActions;
    this.saveQueue();
    this.syncing = false;

    if (failedActions.length > 0) {
      console.warn(`${failedActions.length} actions failed to sync`);
    } else {
      console.log('All actions synced successfully');
    }
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  clearQueue() {
    this.queue = [];
    this.saveQueue();
  }
}

// Singleton instance
export const offlineSync = new OfflineSync();
