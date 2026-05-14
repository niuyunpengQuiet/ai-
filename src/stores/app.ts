import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
  const activeView = ref('chat');

  function setActiveView(view: string) {
    activeView.value = view;
  }

  return { activeView, setActiveView };
});
