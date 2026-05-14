import { defineStore } from 'pinia';
import { ref } from 'vue';
import { BRANDINGS } from '../constants';

export const useBrandStore = defineStore('brand', () => {
  const activeBrand = ref(BRANDINGS[0]);
  const showBrandMenu = ref(false);

  function setBrand(brand: any) {
    activeBrand.value = brand;
    showBrandMenu.value = false;
  }

  return { activeBrand, showBrandMenu, setBrand, brands: BRANDINGS };
});
