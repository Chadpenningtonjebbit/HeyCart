import { create } from 'zustand';
import { WidgetConfig } from './types';

interface WidgetStore {
  widgets: WidgetConfig[];
  addWidget: (widget: WidgetConfig) => void;
  updateWidget: (id: string, widget: Partial<WidgetConfig>) => void;
  removeWidget: (id: string) => void;
}

type WidgetStoreState = {
  widgets: WidgetConfig[];
};

type WidgetStoreActions = {
  addWidget: (widget: WidgetConfig) => void;
  updateWidget: (id: string, widget: Partial<WidgetConfig>) => void;
  removeWidget: (id: string) => void;
};

export const useWidgetStore = create<WidgetStore>((set) => ({
  widgets: [],
  addWidget: (widget: WidgetConfig) => set((state: WidgetStoreState) => ({ widgets: [...state.widgets, widget] })),
  updateWidget: (id: string, widget: Partial<WidgetConfig>) => set((state: WidgetStoreState) => ({
    widgets: state.widgets.map((w: WidgetConfig) => (w.id === id ? { ...w, ...widget } : w))
  })),
  removeWidget: (id: string) => set((state: WidgetStoreState) => ({
    widgets: state.widgets.filter((w: WidgetConfig) => w.id !== id)
  }))
})); 