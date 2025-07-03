import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'
import ActiveCasesChart from '@/components/ActiveCasesChart.vue'
import ContinentChart from '@/components/ContinentChart.vue'
import CountryPieChart from '@/components/CountryPieChart.vue'
import CountryDeathChart from '@/components/CountryDeathChart.vue'
import CovidMap from '@/components/CovidMap.vue'

// Mock Chart.js pour éviter les erreurs de canvas dans jsdom
vi.mock('chart.js/auto', () => ({
  __esModule: true,
  default: vi.fn().mockImplementation(() => ({
    destroy: vi.fn(),
    update: vi.fn()
  }))
}))

describe('HelloWorld.vue', () => {
  it('affiche le message passé en prop', () => {
    const wrapper = shallowMount(HelloWorld, {
      props: { msg: 'Bienvenue sur le dashboard Covid' }
    })
    expect(wrapper.text()).toContain('Bienvenue sur le dashboard Covid')
  })
})

describe('ActiveCasesChart.vue', () => {
  it('affiche un canvas', () => {
    const data = [
      { country_region: "France", active_case: 100, population: 1000 },
      { country_region: "USA", active_case: 200, population: 2000 }
    ]
    const wrapper = shallowMount(ActiveCasesChart, {
      props: { data, limit: 2, displayMode: 'bar' }
    })
    expect(wrapper.find('canvas').exists()).toBe(true)
  })
})

describe('ContinentChart.vue', () => {
  it('affiche un canvas', () => {
    const data = [
      { name: "Europe", total_cases: 1000 },
      { name: "Asia", total_cases: 2000 }
    ]
    const wrapper = shallowMount(ContinentChart, {
      props: { data, metricKey: 'total_cases' }
    })
    expect(wrapper.find('canvas').exists()).toBe(true)
  })
})

describe('CountryPieChart.vue', () => {
  it('affiche un canvas', () => {
    const data = [
      { country_region: "France", total_cases: 1000 },
      { country_region: "USA", total_cases: 2000 }
    ]
    const wrapper = shallowMount(CountryPieChart, {
      props: { data }
    })
    expect(wrapper.find('canvas').exists()).toBe(true)
  })
})

describe('CountryDeathChart.vue', () => {
  it('affiche un canvas', () => {
    const data = [
      { country_region: "France", total_deaths: 100 },
      { country_region: "USA", total_deaths: 200 }
    ]
    const wrapper = shallowMount(CountryDeathChart, {
      props: { data }
    })
    expect(wrapper.find('canvas').exists()).toBe(true)
  })
})

// Mock fetch pour CovidMap
global.fetch = vi.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve('Country/Region,Continent,TotalCases,TotalDeaths\nFrance,Europe,1000,10'),
    json: () => Promise.resolve({ features: [] })
  })
);

describe('CovidMap.vue', () => {
  it('se monte sans erreur', () => {
    const data = [
      { country_region: "France", continent: "Europe", total_cases: 1000, total_deaths: 10, population: 1000000 }
    ]
    const wrapper = shallowMount(CovidMap, {
      props: { data, view: 'country' }
    })
    expect(wrapper.find('#covid-map').exists()).toBe(true)
  })
})