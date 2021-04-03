<template v-if="visible">
  <select class="selectMenu--ul" ref="selectDom" multiple v-model="selectedvalues" @keyup="doKeyup" @click="doClick">
    <option v-for="(item, index) in list" class="selectMenu--li" :value="index" :selected="index===selectedvalues">{{ selectedvalues }}
      {{ item }}
    </option>
  </select>
</template>

<script lang="ts">
// import {__getType} from '../../util/gobalUtil'
import { InputWord, RomajiMap } from './type'
import { defineComponent, PropType, ref, computed, onMounted, nextTick } from 'vue'

export default defineComponent({
  name: '选择平假名',
  props: {
    wordIndex: Number,
    item: Object as PropType<InputWord>, // {key: "ji", value: Array(2), wordIndex: 0}
  },
  setup(props, { emit }) {
    const selectDom = ref(null)
    const selectedvalues = ref<number[]>([0])    // 默认选中第一个

    const doKeyup = (event) => {
      const key = event.key
      // console.log({ key })
      switch (key) {
          // case 'ArrowUp': //
          //   break
          // case 'ArrowDown':
          //   break

              // todo 按左右键时要重新聚焦到 helloword.vue上
        case 'Enter':
          const wordIndexInSentence: number = props.item.wordIndex
          const selectedIndex: number = selectedvalues.value[0]
          const katakanaText: string = props.item.value[selectedIndex]
          const selectedKatakanaObj: RomajiMap = { wordIndexInSentence, selectedIndex, katakanaText }

          emit('chooseWord', selectedKatakanaObj)
          break
        default:
          break
      }
    }

    const doClick = () => {
      // console.log({ selected: selected.value, selectedvalues: selectedvalues.value })
    }

    const list = computed(() => {
      return props.item?.value || []
    })

    onMounted(() => {
      nextTick(() => {
        selectDom.value?.focus()
        // selectedvalues.value = [0]
      })
    })

    return {
      list,
      selectDom,
      selectedvalues,
      doKeyup,
      doClick,
    }
  },

  // created () {
  //   if (this.defaultChooseIndex) {
  //     let chooseList = this.defaultChooseIndex
  //     if (__getType(this.defaultChooseIndex) === '[object Number]') {
  //       chooseList = this.defaultChooseIndex.toString().split(',')
  //     }
  //     this.selected = chooseList.map((item) => {
  //       return this.list[item]
  //     })
  //   }
  // },
  // mounted () {
  // },
  // data () {
  //   return {
  //     selected: [...this.list[0]],
  //     // selected: this.defaultIndex ? this.defaultIndex : [...this.list[0]],
  //     visible: false,
  //   }
  // },
  // watch   : {
  //   show (newVal) {
  //     this.visible = newVal
  //     if (newVal) {
  //       this.$nextTick(() => {
  //         if (this.$refs && this.$refs.selectEle) {
  //           this.$refs.selectEle.focus()
  //         }
  //       })
  //     }
  //   },
  // },
  // props   : {
  //   list              : {type: Array, default: () => []},
  //   defaultChooseIndex: {type: Number},
  //   show              : {type: Boolean, default: false},
  //   editingWordIndex  : {type: Number},                      // 当前输入的单词的索引, 初始化或者从历史记录中拿出来的时候是空的
  // },
  // methods : {
  //   handleClickEnter () {
  //     const chooseIndex = this.list.indexOf(this.selected[0])
  //     this._emitSelect(this.selected[0], chooseIndex)
  //   },
  //   _emitSelect (item, index) {
  //     this.$emit('onChoose', item, index, this.editingWordIndex)
  //   },
  //   // handleSelect (a, b, c) {
  //   //     console.log(a, b, c)
  //   // },
  //   // otherKeyDown (e) {
  //   //     if (e.key !== 'Enter' && e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
  //   //         this.$emit('callback', undefined, this.selectedIndex, this.wordIndexInArr, this.key)
  //   //     }
  //   // }
  // },
  // computed: {
  //   // wordIndexInArr () {
  //   //     return this.list.indexOf(this.selected[0])
  //   // }
  // },
})
</script>

<style scoped lang="scss">

.selectMenu--ul {
  width: 100px;
  background: yellow;

  .selectMenu--li {
    margin-bottom: 5px;
    background: green;
  }
}
</style>
