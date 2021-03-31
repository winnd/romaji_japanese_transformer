<template>
  <div class='hello'>
    <p>
      <a href="http://www.earth.sinica.edu.tw/webearth-library.../files/JP.htm"
         target="_blank"
      >五十音图参考表</a></p>
    <p class='showWrapper'>
      <template v-for="(item,index) in inputWord">
        <span>{{ item.value }}</span>
      </template>
    </p>

    <p><label for='transform'>请在下方输入要转换的罗马音并以空格间隔</label></p>
    <textarea name='input'
              id='transform'
              class="textarea"
              ref="textarea"
              @input='inputKey'
              v-model="textAreaStr"
    ></textarea>

    <label>
      <!--      <Select :list="a.ji"-->
      <!--              v-if="showRecommend"-->
      <!--              :selectedIndex="selectedIndex"-->
      <!--              @onSelect="selectedText"-->
      <!--      ></Select>-->
      <!--:selectedIndex="selectedIndex"-->
    </label>
  </div>
</template>

<script>
import dictionary from './wordList.json'
import Select from './select/Select.vue'

export default {
  name: 'HelloWorld',
  data () {
    return {
      inputWord    : [
        {

          selected      : false,
          selectedIndex : '',
          wordIndexInArr: 0,
          otherWord     : '',
        },
      ],          // 输入内容与对应关系
      textAreaStr  : '',          // 输入的罗马音 ji
      selectedIndex: 0,          // 该单词的位置
      showRecommend: false,       // 显示下拉选框 flag
      // selectedIndex: 0,          // 需要选择的罗马文的index
      a: dictionary,
    }
  },
  methods   : {
    async inputKey (event) {
      const validated = await this.validateWord(event.data)
      if (validated) {
        console.log(event)
        this.inputWord = []
        let oldInputWord = this.inputWord.filter(x => x.wordIndexInArr !== undefined)      // 有index的要存下来
        let textAreaStrArr = this.textAreaStr.trim()
            .split(' ')                  // 按空格分割为数组
            .filter(x => { return x !== '' })     // 过滤为空的

        this.inputWord = textAreaStrArr.map(x => {
          return {key: x}
        })

        oldInputWord.map(x => {
          if (this.inputWord[x.index]) {
            this.inputWord[x.index].index = x.index
            this.inputWord[x.index].wordIndexInArr = x.wordIndexInArr
            this.inputWord[x.index].value = x.value
          }
        })

        // var key         = textAreaStrArr[textAreaStrArr.length - 1]   // 最后一个word
        console.log(this.inputWord)
        this.inputWord.map((x, i) => {
          if (x.index !== undefined && event.inputType !== 'deleteContentBackward') { return }
          if (x.key !== '') {
            switch (Object.prototype.toString.call(this.a[x.key])) {
              case '[object String]':
                x.value = this.a[x.key]
                this.showRecommend = false
                return x
              case '[object Array]':
                // var target = this.inputStr.split(' ')[x.index] === x.key
                let target = x.index === undefined ? false : (oldInputWord[x.index].key === x.key)
                if (x.index !== undefined && !target) {              // 已经改过了 并且删除了一部分
                  delete x.index     // 归零
                  x.value = x.key
                } else if (x.index !== undefined && target) {    // 未做改动, 保持原样
                } else {        // 新加的 初始化
                  x.value = x.key    // 默认value
                  x.index = i
                  this.showRecommend = true
                }
                this.selectedIndex = x.index
                return x
              default:
                if (x.index) { delete x.index }
                if (x.value) { delete x.value }
                if (x.wordIndexInArr !== undefined) { delete x.wordIndexInArr }
                x.value = this.a[x.key] === undefined ? x.key : x.key
                this.showRecommend = false
                return x
            }
          }
        })
      } else {
        console.warning('不可识别的字符')
      }
    },
    selectedText (value, index, wordIndexInArr, otherKey) {
      if (value !== undefined) {
        this.showRecommend = false
        this.inputWord[index].wordIndexInArr = wordIndexInArr
        this.inputWord[index].value = value[0]
      } else {
        // this.sentence[index].value = otherKey
      }
      this.$refs.textarea.focus()
    },
    validateWord (str) {
      return new Promise((resolve) => {
        switch (str) {
          case  ' ' :
            resolve(false)
            return false
          case 'deleteContentBackward':
            resolve(false)
            return false
          default:
            resolve(true)
        }
      }).catch(e => {
        console.error(e)
      })
    },
  },
  components: {Select},
}

</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>

.showWrapper {
  margin: 0 auto;
  width: 400px;
}

.textarea {
  width: 400px;
  height: 200px;
}
</style>
