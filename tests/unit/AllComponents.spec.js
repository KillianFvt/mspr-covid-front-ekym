import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'
import BarChart from '@/components/BarChart.vue'
import DeathChart from '@/components/DeathChart.vue'
import PopChart from '@/components/PopChart.vue'
import CovidMap from '@/components/CovidMap.vue'

describe('HelloWorld.vue', () => {
  it('affiche le message passé en prop', () => {
    const wrapper = shallowMount(HelloWorld, {
      props: { msg: 'Bienvenue sur le dashboard Covid' }
    })
    expect(wrapper.text()).toContain('Bienvenue sur le dashboard Covid')
  })
})

describe('BarChart.vue', () => {
  it('affiche un svg avec le bon nombre de parts', () => {
    const data = [
      { country_region: "France", total_cases: 10 },
      { country_region: "USA", total_cases: 20 },
      { country_region: "Spain", total_cases: 30 }
    ]
    const wrapper = shallowMount(BarChart, {
      props: { data }
    })
    // Vérifie qu'il y a autant de <path> que de données (parts du camembert)
    expect(wrapper.findAll('path').length).toBe(data.length)
  })
})

describe('DeathChart.vue', () => {
  it('affiche un svg', () => {
    const data = [
      { country_region: "France", total_death: 10 },
      { country_region: "USA", total_death: 20 }
    ]
    const wrapper = shallowMount(DeathChart, {
      props: { data }
    })
    expect(wrapper.find('svg').exists()).toBe(true)
  })
})

describe('PopChart.vue', () => {
  it('affiche un svg', () => {
    const data = [
      { population: 100, total_cases: 10 },
      { population: 200, total_cases: 20 }
    ]
    const wrapper = shallowMount(PopChart, {
      props: { data }
    })
    expect(wrapper.find('svg').exists()).toBe(true)
  })
})

global.fetch = jest.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve('Country/Region,Continent,TotalCases,TotalDeaths\nFrance,Europe,1000,10'),
    json: () => Promise.resolve({ features: [] })
  })
);
describe('CovidMap.vue', () => {
  it('affiche la légende si continentData est défini', async () => {
    const wrapper = shallowMount(CovidMap)
    // Simule la présence de continentData
    await wrapper.setData({
      continentData: {
        Europe: { cases: 1000, deaths: 10 },
        Asia: { cases: 2000, deaths: 20 }
      }
    })
    expect(wrapper.find('.legend').exists()).toBe(true)
  })
})