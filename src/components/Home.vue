<template>
  <div class="container">
    <div class="form">
      <span>
        {{ $t('labels.rows') }}
        <button @click="updateNumber('row', 'dec')">-</button>
        <span v-text="numberRows"></span>
        <button @click="updateNumber('row', 'inc')">+</button>
      </span>
      <span>
        {{ $t('labels.columns') }}
        <button @click="updateNumber('col', 'dec')">-</button>
        <span v-text="numberColumns"></span>
        <button @click="updateNumber('col', 'inc')">+</button>
      </span>
      <div class="list-colors">
        <label>
          <input type="radio" name="selectedColor" value="none" v-model="selectedColor" />
          <span><i class="fa fa-trash-o"></i></span>
        </label>
        <label v-for="(color, indexColor) in listColors" :key="indexColor">
          <input type="radio" name="selectedColor" :value="color" v-model="selectedColor" />
          <span><i class="fa fa-check"></i></span>
        </label>
      </div>
      <div class="save">
        <button class="reset" @click="resetAll()"><i class="fa fa-plus"></i> {{ $t('labels.new') }}</button>
        <button class="save-button" @click="saveDrawing()"><span class="tooltip" :class="[activeSavedTooltip ? 'active' : '']">Saved <i class="fa fa-check"></i></span><i class="fa fa-save"></i> {{ $t('labels.save') }}</button>
        <button class="delete-button" v-if="drawingSaved" @click="deleteDrawing()"><i class="fa fa-trash-o"></i> {{ $t('labels.delete') }}</button>
      </div>
      <ul class="list-drawings" v-if="savedDrawings">
        <li v-if="JSON.parse(savedDrawings).length">{{ $t('labels.listDrawings') }}</li>
        <li v-for="(drawing, index) in JSON.parse(savedDrawings)" :key="index"><button :class="[drawing.id === currentDrawingId ? 'active' : '']" @click="selectDrawing(drawing.id)">#{{ index + 1 }}</button></li>
      </ul>
    </div>
    <div class="drawing-canvas-container">
      <div class="drawing-canvas" :data-hover="selectedColor">
        <ul v-for="(row, indexRow) in numberRows" :key="indexRow">
          <li v-for="(column, indexColumn) in numberColumns" :key="indexColumn" :data-color="boxColor(row, column)" @click="addRemoveColor(row, column)">
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      numberRows: 16,
      numberColumns: 16,
      listColors: ['turquoise', 'green-sea', 'emerald', 'nephritis', 'peter-river', 'belize-hole', 'amethyst', 'wisteria', 'wet-asphalt', 'midnight-blue', 'sun-flower', 'orange', 'carrot', 'pumpkin', 'alizarin', 'pomegranate', 'silver', 'concrete', 'asbestos'],
      selectedColor: 'turquoise',
      savedColors: [],
      currentDrawingId: null,
      drawingSaved: false,
      activeSavedTooltip: false,
      savedDrawings: null
    }
  },
  methods: {
    addRemoveColor (indexRow, indexColumn) {
      var colorFound = this.savedColors.find((el) => { return el.row === indexRow && el.column === indexColumn })
      if (!colorFound && this.selectedColor !== 'none') {
        this.savedColors.push({
          row: indexRow,
          column: indexColumn,
          color: this.selectedColor
        })
      } else if (colorFound) {
        var indexColor = this.savedColors.indexOf(colorFound)
        this.savedColors.splice(indexColor, 1)
        if (this.selectedColor !== 'none') {
          this.savedColors.push({
            row: indexRow,
            column: indexColumn,
            color: this.selectedColor
          })
        }
      }
    },
    updateNumber (type, way) {
      if (way === 'inc') {
        if (type === 'row') {
          this.numberRows += 1
        } else {
          this.numberColumns += 1
        }
      } else {
        if (type === 'row' && this.numberRows > 1) {
          this.numberRows -= 1
        } else if (type === 'col' && this.numberColumns > 1) {
          this.numberColumns -= 1
        }
      }
    },
    boxColor (indexRow, indexColumn) {
      var colorFound = this.savedColors.find((el) => { return el.row === indexRow && el.column === indexColumn })
      if (colorFound) {
        return colorFound.color
      }
      return false
    },
    saveDrawing () {
      var currentDrawing = {
        id: this.currentDrawingId,
        rows: this.numberRows,
        columns: this.numberColumns,
        savedColors: this.savedColors
      }

      localStorage.setItem('loadedDrawingId', this.currentDrawingId)
      if (localStorage.getItem('savedDrawings')) {
        var savedDrawings = JSON.parse(localStorage.getItem('savedDrawings'))
        if (savedDrawings.find((el) => { return el.id === this.currentDrawingId })) {
          var indexSavedDrawing = savedDrawings.findIndex((el) => { return el.id === this.currentDrawingId })
          savedDrawings[indexSavedDrawing] = currentDrawing
        } else {
          savedDrawings.push(currentDrawing)
        }
        localStorage.setItem('savedDrawings', JSON.stringify(savedDrawings))
      } else {
        localStorage.setItem('savedDrawings', JSON.stringify([currentDrawing]))
      }
      this.drawingSaved = this.isDrawingSaved()
      this.savedDrawings = localStorage.getItem('savedDrawings')
      this.activeSavedTooltip = true
      setTimeout(() => {
        this.activeSavedTooltip = false
      }, 3000)
    },
    isDrawingSaved () {
      if (localStorage.getItem('savedDrawings')) {
        var savedDrawings = JSON.parse(localStorage.getItem('savedDrawings'))
        if (savedDrawings.find((el) => { return el.id === this.currentDrawingId })) {
          return true
        }
      }
      return false
    },
    deleteDrawing () {
      if (localStorage.getItem('savedDrawings')) {
        var savedDrawings = JSON.parse(localStorage.getItem('savedDrawings'))
        if (savedDrawings.find((el) => { return el.id === this.currentDrawingId })) {
          var indexSavedDrawing = savedDrawings.findIndex((el) => { return el.id === this.currentDrawingId })
          savedDrawings.splice(indexSavedDrawing, 1)
          localStorage.setItem('savedDrawings', JSON.stringify(savedDrawings))
        }
        this.savedDrawings = localStorage.getItem('savedDrawings')
      }
      this.resetAll()
    },
    resetAll () {
      this.numberRows = 16
      this.numberColumns = 16
      this.selectedColor = 'turquoise'
      this.savedColors = []
      if (localStorage.getItem('loadedDrawingId')) {
        localStorage.removeItem('loadedDrawingId')
      }
      this.currentDrawingId = this.generateNewDrawingId()
      this.drawingSaved = this.isDrawingSaved()
    },
    generateNewDrawingId () {
      let currentDrawingId = null
      var drawingIdFound = true
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

      while (drawingIdFound) {
        var newDrawingId = ''

        for (var i = 0; i < 5; i++) {
          newDrawingId += possible.charAt(Math.floor(Math.random() * possible.length))
        }

        currentDrawingId = newDrawingId
        if (localStorage.getItem('savedDrawings')) {
          var savedDrawings = JSON.parse(localStorage.getItem('savedDrawings'))
          drawingIdFound = typeof savedDrawings.find((el) => { return el.id === newDrawingId }) !== 'undefined'
        } else {
          drawingIdFound = false
        }
      }
      return currentDrawingId
    },
    selectDrawing (id) {
      localStorage.setItem('loadedDrawingId', id)
      this.findCurrentDrawing()
      this.drawingSaved = this.isDrawingSaved()
    },
    findCurrentDrawing () {
      if (localStorage.getItem('loadedDrawingId') && localStorage.getItem('savedDrawings')) {
        var savedDrawings = JSON.parse(localStorage.getItem('savedDrawings'))
        var drawing = savedDrawings.find((el) => { return el.id === localStorage.getItem('loadedDrawingId') })
        if (drawing) {
          this.currentDrawingId = localStorage.getItem('loadedDrawingId')
          this.numberRows = drawing.rows
          this.numberColumns = drawing.columns
          this.savedColors = drawing.savedColors
        } else {
          localStorage.removeItem('loadedDrawingId')
        }
      }
    }
  },
  mounted () {
    this.savedDrawings = localStorage.getItem('savedDrawings')
    this.currentDrawingId = this.generateNewDrawingId()
    this.findCurrentDrawing()
    this.drawingSaved = this.isDrawingSaved()
  }
}
</script>

<style lang="scss">
@import '../assets/stylesheets/variables';

.form {
  .save {
    a {
      display: inline-block;
      font-size: 0.875em;
      padding: 8px 15px;
      cursor: pointer;
      background: $turquoise;
      border: none;
      border-radius: 3px;
      color: $clouds;
    }
  }
}
</style>

<style lang="scss" scoped>
@import '../assets/stylesheets/variables';
@import '../assets/stylesheets/colors';

.form {
  button {
    background: $midnightBlue;
    border: none;
    border-radius: 3px;
    color: $clouds;

    &.reset {
      background: $pomegranate;
    }
    &,
    &:active,
    &:hover,
    &:focus {
      outline: 0;
    }
  }

  .list-colors {
    display: flex;
    flex-wrap: wrap;
    margin-top: 30px;

    i.fa {
      opacity: 0;
      visibility: hidden;
      font-size: 1.5em;
      line-height: 50px;
      color: white;
      transition: .3s all;
    }
    input[name="selectedColor"] {
      opacity: 0;
      visibility: hidden;

      &:checked + span {
        i.fa {
          opacity: 1;
          visibility: visible;
        }
      }
    }
    label {
      flex: 1 0 10%;
      height: 50px;
      position: relative;
      cursor: pointer;

      @media screen and (max-width: 768px) {
        flex: 1 0 20%;
      }
    }
    input[type="radio"] + span {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    input[value="none"] {
      + span {
        border: 2px solid $silver;
        transition: .3s all;

        i.fa-trash-o {
          color: $silver;
          line-height: 46px;
          opacity: 1;
          visibility: visible;
        }
      }
      &:checked {
        + span {
          border-color: $midnightBlue;

          i.fa-trash-o {
            color: $midnightBlue;
          }
        }
      }
    }
  }

  .save {
    margin-top: 30px;

    button {
      padding: 8px 15px;
      cursor: pointer;
      background: $midnightBlue;
      border: none;
      border-radius: 3px;
      color: $clouds;
    }
    .reset {
      background-color: $greenSea;
    }
    .delete-button {
      background-color: $pomegranate;
    }
    .save-button {
      position: relative;

      .tooltip {
        position: absolute;
        top: -100%;
        left: 50%;
        transform: translate(-50%, 100%);
        background-color: rgba(255, 255, 255, .25);
        border-radius: 3px;
        white-space: nowrap;
        padding: 8px 15px;
        color: $midnightBlue;
        opacity: 0;
        visibility: hidden;
        transition: .3s all ease-in-out;

        &.active {
          opacity: 1;
          visibility: visible;
          transform: translate(-50%, -10px);
        }
      }
    }
  }
}

.list-drawings {
  display: flex;
  align-items: center;
  justify-content: center;
  list-style: none;
  margin: 20px 0 0;
  padding: 0;

  li {
    margin: 5px 5px 0 0;

    &:last-child {
      margin-right: 0;
    }
    button {
      padding: 5px 10px;
      cursor: pointer;
      background: $greenSea;
      border: none;
      border-radius: 3px;
      color: $clouds;
      transition: .3s all;

      &.active {
        background: $turquoise;
      }
    }
  }
}

.drawing-canvas-container {
  max-width: 100%;
  overflow: auto;
  padding: 0 30px;

  .drawing-canvas {
    background: $clouds;
    display: table;
    border-collapse: collapse;
    margin: 30px auto;

    &.no-border {
      ul {
        li {
          border: none;
        }
      }
    }
    ul {
      display: table-row;
      list-style: none;
      margin: 0 auto;
      padding: 0;

      li {
        display: table-cell;
        margin: 0;
        padding: 0;
        width: 30px;
        height: 30px;
        min-width: 30px;
        border: 1px solid $silver;
      }
    }
  }
}
</style>
