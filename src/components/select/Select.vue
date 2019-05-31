<template>
  <select class="ul" multiple ref="selectEle"
          @keyup.13="$emit('callback',seleced,selectedIndex,wordIndexInArr,otherWord)"
          @keydown="otherKeyDown"
          v-model="seleced">
          <!--@keyup.13="$emit('callback',seleced,selectedIndex,wordIndexInArr)"-->
    <option class="li"
            v-for="(item,index) in list" :key="index"
            @click="$emit('clicked')">
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
        seleced         : [...this.list[0]],
        wordIndexInArray: 0,
        otherWord       : ''
      }
    },
    props   : {
      list         : {
        type: Array,
        default () {
          return []
        }
      },
      selectedIndex: {
        type: Number
      }
    },
    methods : {
      otherKeyDown (e) {
        if (e.key !== 'Enter' && e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
          this.$emit('callback', undefined, this.selectedIndex, this.wordIndexInArr, this.key)
        }
        // var _this = this
        // this.$nextTick(function () {
        //   document.addEventListener('keydown', function (e) {
        //     _this.bindKey(e)
        //   })
        // })
      }/* , */
      // bindKey (e) {
      //   console.log(e)
      //   if (e.keyCode !== 13 && e.keyCode !== 38 && e.keyCode !== 40) {
      //     debugger
      //     this.$emit('callback', this.list[0], this.selectedIndex, this.wordIndexInArr, this.key)
      //   }
      // }
    },
    computed: {
      wordIndexInArr () {
        return this.list.indexOf(this.seleced[0])
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

.selected {
  background: greenyellow;
}
</style>
