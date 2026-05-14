import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { AGENTS, SKILLS, KNOWLEDGE_BASES } from '../constants';

export const useAgentStore = defineStore('agent', () => {
  const agents = ref([...AGENTS]);

  const workers = computed(() => agents.value.filter(a => a.role === 'Worker'));
  const routers = computed(() => agents.value.filter(a => a.role === 'Router'));
  const supervisors = computed(() => agents.value.filter(a => a.role === 'Supervisor'));

  function addAgent(agent: any) {
    agents.value.push(agent);
  }

  function updateAgent(id: string, data: any) {
    const idx = agents.value.findIndex(a => a.id === id);
    if (idx !== -1) agents.value[idx] = data;
  }

  function removeAgent(id: string) {
    agents.value = agents.value.filter(a => a.id !== id);
  }

  return { agents, workers, routers, supervisors, addAgent, updateAgent, removeAgent };
});

export const useSkillStore = defineStore('skill', () => {
  const skills = ref([...SKILLS]);
  return { skills };
});

export const useKnowledgeStore = defineStore('knowledge', () => {
  const knowledgeBases = ref([...KNOWLEDGE_BASES]);
  return { knowledgeBases };
});
