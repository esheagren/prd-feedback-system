import { create } from 'zustand'

type FeedbackItem = {
  considerations: string[];
  actionItems: string[];
  status: 'pending' | 'loading' | 'completed' | 'error';
}

type FeedbackStore = {
  prdContent: string;
  feedback: Record<string, FeedbackItem>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setPRDContent: (content: string) => void;
  setFeedback: (feedback: Record<string, FeedbackItem>) => void;
  updateFeedbackStatus: (role: string, status: FeedbackItem['status']) => void;
}

export const useStore = create<FeedbackStore>((set) => ({
  prdContent: '',
  feedback: {
    'ux-ui-designer': { considerations: [], actionItems: [], status: 'pending' },
    'senior-product-manager': { considerations: [], actionItems: [], status: 'pending' },
    'backend-engineer': { considerations: [], actionItems: [], status: 'pending' },
  },
  activeTab: 'ux-ui-designer',
  setActiveTab: (tab) => set({ activeTab: tab }),
  setPRDContent: (content) => set({ prdContent: content }),
  setFeedback: (feedback) => set({ feedback }),
  updateFeedbackStatus: (role, status) => 
    set((state) => ({
      feedback: {
        ...state.feedback,
        [role]: {
          ...state.feedback[role],
          status
        }
      }
    }))
}))