<template>
  <div class="map-container">
    <div id="worldMap">
      <svg viewBox="0 0 1000 500">
        <!-- La carte sera injectée ici -->
      </svg>
    </div>
    <div class="tooltip" v-show="tooltipData" :style="tooltipStyle">
      <h3>{{ tooltipData?.country }}</h3>
      <p>Cas totaux : {{ tooltipData?.cases?.toLocaleString() }}</p>
      <p>Décès : {{ tooltipData?.deaths?.toLocaleString() }}</p>
      <p>Guérisons : {{ tooltipData?.recovered?.toLocaleString() }}</p>
    </div>
    <div class="legend" v-if="continentData">
      <div v-for="(value, continent) in continentData" :key="continent" class="legend-item">
        <span class="color-box" :style="{ backgroundColor: getColor(value.cases) }"></span>
        <span>{{ continent }}: {{ value.cases.toLocaleString() }} cas</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import Papa from 'papaparse'

export default {
  name: 'CovidMap',
  data() {
    return {
      continentData: null,
      colorScale: null,
      covidData: [],
      tooltipData: null,
      tooltipStyle: {
        left: '0px',
        top: '0px'
      }
    }
  },
  methods: {
    async loadCSV() {
      const response = await fetch('/worldometer_data.csv')
      const csvText = await response.text()
      return new Promise((resolve) => {
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            this.covidData = results.data
            this.processCovidData()
            resolve()
          }
        })
      })
    },
    async drawMap() {
      const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      const geoData = await response.json()

      const svg = d3.select("#worldMap svg")
      const projection = d3.geoMercator()
          .scale(130)
          .center([0,20])
          .translate([500, 250])

      const path = d3.geoPath().projection(projection)

      const maxCases = Math.max(...Object.values(this.continentData).map(d => d.cases))
      this.colorScale = d3.scaleSequential()
          .domain([0, maxCases])
          .interpolator(d3.interpolateReds)

      svg.selectAll("path")
          .data(geoData.features)
          .enter()
          .append("path")
          .attr("d", path)
          .attr("fill", d => {
            const continent = this.getContinent(d.properties.name)
            return continent ? this.getColor(this.continentData[continent].cases) : '#ccc'
          })
          .attr("stroke", "#fff")
          .attr("stroke-width", 0.5)
          .on("mouseover", (event, d) => {
            const countryData = this.getCountryData(d.properties.name)
            if (countryData) {
              this.tooltipData = {
                country: countryData['Country/Region'],
                cases: parseInt(countryData.TotalCases) || 0,
                deaths: parseInt(countryData.TotalDeaths) || 0,
                recovered: parseInt(countryData.TotalRecovered) || 0
              }
              this.tooltipStyle = {
                left: `${event.x}px`,
                top: `${event.y}px`
              }
            }
          })
          .on("mousemove", (event) => {
            this.tooltipStyle = {
              left: `${event.offsetX}px`,
              top: `${event.offsetY}px`
            }
          })
          .on("mouseout", (event) => {
            this.tooltipData = null
            d3.select(event.currentTarget)
                .attr("stroke-width", 0.5)
                .attr("stroke", "#fff")
          })
    },
    processCovidData() {
      this.continentData = {}
      this.covidData.forEach(row => {
        if (row.Continent && row.TotalCases) {
          if (!this.continentData[row.Continent]) {
            this.continentData[row.Continent] = {
              cases: 0,
              deaths: 0
            }
          }
          this.continentData[row.Continent].cases += parseInt(row.TotalCases) || 0
          this.continentData[row.Continent].deaths += parseInt(row.TotalDeaths) || 0
        }
      })
    },
    getColor(cases) {
      return this.colorScale ? this.colorScale(cases) : '#ccc'
    },
    getContinent(countryName) {
      const country = this.covidData.find(row => row['Country/Region'] === countryName)
      return country ? country.Continent : null
    },
    getCountryData(countryName) {
      return this.covidData.find(row => row['Country/Region'] === countryName)
    }
  },
  async mounted() {
    await this.loadCSV()
    await this.drawMap()
  }
}
</script>

<style scoped>
.map-container {
  height: 600px;
  width: 100%;
  margin: 0 auto;
  position: relative;
}

#worldMap {
  width: 100%;
  height: 100%;
}

.legend {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.legend-item {
  display: flex;
  align-items: center;
  margin: 5px 0;
}

.color-box {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  border-radius: 3px;
}

.tooltip {
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  padding: 10px 15px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
  pointer-events: none;
  z-index: 1000;
}

.tooltip h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: bold;
}

.tooltip p {
  margin: 4px 0;
  font-size: 12px;
}
</style>