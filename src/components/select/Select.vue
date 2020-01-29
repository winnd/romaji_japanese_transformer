<template>
  <select multiple
          class="ul"
          ref="selectEle"
          v-model="selected"
          @keyup.13="emitClickEnter"
  >
    <!--    @keydown="otherKeyDown"-->
    <!--@keyup.13="$emit('callback',selected,selectedIndex,wordIndexInArr)"-->
    <option class="li"
            value="item"
            :key="index"
            v-for="(item, index) in list"
            @click="handleSelect(item, index)"
    >
      {{item}}
    </option>
  </select>
</template>

<script>
  export default {
    mounted () {
      this.$refs.selectEle.focus()
      this.$refs.selectEle.options[0].selected = true
    },
    data () {
      return {
        selected        : this.defaultIndex ? this.defaultIndex : [...this.list[0]],
        wordIndexInArray: 0,
        otherWord       : ''
      }
    },
    props   : {
      list         : {type: Array, default: () => []},
      selectedIndex: {type: Number},
      defaultIndex : {type: Number}
    },
    methods : {
      emitClickEnter () {
        this.$emit('onSelect', this.selected, selectedIndex, wordIndexInArr, otherWord)
      },
      handleSelect (a, b, c) {
        console.log(a, b, c)
      },
      otherKeyDown (e) {
        if (e.key !== 'Enter' && e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
          this.$emit('callback', undefined, this.selectedIndex, this.wordIndexInArr, this.key)
        }
      }
    },
    computed: {
      wordIndexInArr () {
        return this.list.indexOf(this.selected[0])
      }
    }
  }
</script>

<style scoped type="text/css">
  @import "../../css/default.css";

  .ul {
    width: 100px;
    background: yellow;
  }

  .li {
    margin-bottom: 5px;
    background: green;
  }
</style>
