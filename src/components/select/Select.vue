<template>
  <select v-if="visible"
          class="ul"
          ref="selectEle"
          multiple
          v-model="selected"
          @keyup.13="handleClickEnter"
  >
    <!--       -->
    <!--@keyup.13="$emit('callback',selected,selectedIndex,wordIndexInArr)"-->
    <!--    @keydown="otherKeyDown"-->

    <option class="li" :key="index" :value="item" v-for="(item, index) in list"
    >
      <!--            @click="handleSelect(item, index)"-->
      {{item}}
    </option>
  </select>
</template>

<script>
  /**
   * @props show                      关闭显示状态
   * @props defaultChooseIndex        默认选中 ① 1 ② '2,1' ③ [1,2]
   * @emits onChoose                  选择输出
   */
  import {__getType} from '@/util/gobalUtil'

  export default {
    created () {
      if (this.defaultChooseIndex) {
        let chooseList = this.defaultChooseIndex
        if (__getType(this.defaultChooseIndex) === '[object Number]') {
          chooseList = this.defaultChooseIndex.toString().split(',')
        }
        this.selected = chooseList.map((item) => {
          return this.list[item]
        })
      }
    },
    mounted () {
    },
    data () {
      return {
        selected: [...this.list[0]],
        // selected: this.defaultIndex ? this.defaultIndex : [...this.list[0]],
        visible : false
      }
    },
    watch   : {
      show (newVal) {
        this.visible = newVal
        if (newVal) {
          this.$nextTick(() => {
            if (this.$refs && this.$refs.selectEle) {
              this.$refs.selectEle.focus()
            }
          })
        }
      }
    },
    props   : {
      list              : {type: Array, default: () => []},
      defaultChooseIndex: {type: Number},
      show              : {type: Boolean, default: false},
      editingWordIndex  : {type: Number}                      // 当前输入的单词的索引, 初始化或者从历史记录中拿出来的时候是空的
    },
    methods : {
      handleClickEnter () {
        const chooseIndex = this.list.indexOf(this.selected[0])
        this._emitSelect(this.selected[0], chooseIndex)
      },
      _emitSelect (item, index) {
        this.$emit('onChoose', item, index, this.editingWordIndex)
      }
      // handleSelect (a, b, c) {
      //     console.log(a, b, c)
      // },
      // otherKeyDown (e) {
      //     if (e.key !== 'Enter' && e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
      //         this.$emit('callback', undefined, this.selectedIndex, this.wordIndexInArr, this.key)
      //     }
      // }
    },
    computed: {
      // wordIndexInArr () {
      //     return this.list.indexOf(this.selected[0])
      // }
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
