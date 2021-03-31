<template>
  <div class='hello'>
<!--    <p>-->
<!--      <a href="http://www.earth.sinica.edu.tw/webearth-library.../files/JP.htm"-->
<!--         target="_blank"-->
<!--      >五十音图参考表</a></p>-->
<!--    <p class='showWrapper'>-->
<!--      <template v-for="(item,index) in sentence">-->
<!--        <span :key="index">{{item.transformedWord}}</span>-->
<!--      </template>-->
<!--    </p>-->

<!--    <p>请在下方输入要转换的罗马音并以空格间隔</p>-->
<!--    <textarea @input='inputKey'-->
<!--              v-model="inputStr"-->
<!--              @select="handleSelectText"-->
<!--              ref="textarea"-->
<!--    ></textarea>-->

<!--    <p>-->
<!--      <button @click="change">转片假名</button>-->
<!--    </p>-->

<!--    <Select :list="recommendList"-->
<!--            :show="showRecommend"-->
<!--            @onChoose="handleChoose"-->
<!--            :editingWordIndexInSentence="editingWordIndexInSentence"-->
<!--    />-->
<!--    &lt;!&ndash;    @onSelect="selectWord"&ndash;&gt;-->

  </div>
</template>

<script>
  import dictionary from '../wordList.json'
  import Select from '../select/Select.vue'

  export default {
    name      : 'HelloWorld',
    components: {Select},
    data () {
      return {
        inputStr                  : 'a shi ji',      // 输入的罗马音 ji
        cachedWords               : [                // 缓存
          {
            wordIndex  : 1,         // 是句中的第几个词
            selectIndex: 0,         // 第几个选项(如选了ji的第2个选项
            type       : 'katakana' // 是平假名还是片假名
          },
          {
            wordIndex  : 2,         // 是句中的第几个词
            selectIndex: 1,         // 第几个选项(如选了ji的第2个选项
            type       : 'hiragana' // 是平假名还是片假名
          }
        ],
        dictionaryArr             : [          // dictionary数据扁平化,数组化
          // ['ji', ['じ', 'ぢ']]
        ],
        hiraganaMultipleChoiceList: {          // 一个发音对应多个值的组
          // {'ji': ['じ', 'ぢ']}
          // {"ceshi", ["ce", "shi", "ttt"]}
        },
        hiraganaDictionary        : {         // 平假名
          // {'a':'あ',i: "い"}
        },
        katakanaDictionary        : {         // 片假名
                                              // {あ: "ア", い: "イ"}
        },
        sentence                  : [          // 整段话,每个单词（如:ji）为一个单元
          // {
          //   selected      : '',   // 是否高亮
          //   indexInSentence: 0,    // 该组中的索引 ji 【0，1】
          //   originWord    : '',   // 输入的单词
          //   transformWord : ''    // 转换后的单词
          // }
        ],
        showRecommend             : false,    // 显示推荐
        recommendList             : ['じ', 'ぢ'], // 推荐列表 如 ["じ","ぢ"]
        showKatakana              : false,    // 转为片假名
        editingWordIndexInSentence: undefined // 当前正在输入的文字的索引
      }
    },
    created () {
      this.dictionaryArr = Object.entries(dictionary)

      // 多值平假名 [{'ji': ['じ', 'ぢ']}]
      this.hiraganaMultipleChoiceList = this._getHiraganaMultipleChoiceList()
      // 平假名 {'a':'あ'}
      this.hiraganaDictionary = this._getHiraganaDictionary()
      // 片假名 {あ: "ア", い: "イ"}
      this.katakanaDictionary = this._getKatakanaDictionary()

      this.inputKey()   // 初始化
    },
    methods   : {
      async inputKey (event) {
        // const event = event ? event.inputType : this.inputStr
        const validated = this._validateWord(event)

        debugger
        // 根据敲的按键进行处理 (如回车, 删除键
        this._handleDoSthByKey()

        if (!validated) { return false }

        this.sentence = [] // 清空句子

        // 组装句子
        let sentenceTemp = this.inputStr.trim()
                               .replace(/[\n]/g, ' ')
                               .split(' ')
                               .filter(x => x) // 过滤多余的空字符串
                               .map((item) => {
                                 return {
                                   originWord     : item,         // 原始输入 如: ji
                                   type           : 'hiragana',   // 默认是平假名
                                   indexInSentence: 0,            // 该单词在句子中的索引 r_ 可能用不到
                                   transformedWord: '',           // 最后要显示的单词 如: イ
                                   selected       : false         // 是否被选中高亮
                                 }
                               })
        // 处理普通平假名
        sentenceTemp.map(x => {
          const foundWord = this.hiraganaDictionary[x.originWord]   // 是否能匹配到平假名
          x.transformedWord = foundWord || x.originWord
          return x
        })

        /**
         * this.cachedWords 是要转换过的词 ① 一个发音有多个字可选 ② 来自历史输入的片假名
         * this.cacheWords: [{wordIndex: 2,selectIndex: 1, type: 'hiragana'}]
         */
        if (this.cachedWords.length > 0) {
          // 处理片假名
          this.cachedWords
              .filter((item) => item.type === 'katakana')
              .map((item) => {
                sentenceTemp[item.wordIndex].transformedWord = this.katakanaDictionary[sentenceTemp[item.wordIndex].transformedWord]
                // sentenceTemp[item.wordIndex].indexInSentence = item.wordIndex  // 用不到
              })

          // 处理平假名数组
          debugger
          this.cachedWords
              .filter((item) => item.type === 'hiragana')
              .map((item) => {
                sentenceTemp[item.wordIndex].transformedWord = this.hiraganaMultipleChoiceList[sentenceTemp[item.wordIndex].originWord][item.selectIndex]
                // sentenceTemp[item.wordIndex].indexInSentence = item.wordIndex // 用不到
              })
        }

        this.sentence = sentenceTemp

        // 新输入的要选择的数据
        let target = this.sentence
                         .filter((item, index) => {
                           const isEditing = item.originWord === item.transformedWord

                           if (isEditing) {
                             this.editingWordIndexInSentence = index
                           }
                           return isEditing
                         })
                         .filter(item => this.hiraganaMultipleChoiceList[item.originWord])
        if (target.length > 0) {
          const originWord = target[target.length - 1].originWord
          const recommendList = this.hiraganaMultipleChoiceList[originWord]
          // const currentWordIndex =

          this.showRecommend = true
          this.recommendList = recommendList
        }
      },
      selectWord () {
        this.showRecommend = false
      },
      // 转为片假名
      change (event) {

      },
      // 光标选中文字
      handleSelectText (event) {
        console.log(event)
        let selectedText = document.getSelection().toString()
        if (selectedText.length === 0) {
          this.showKatakana = true
        }
      },
      // this.cacheWords: [{wordIndex: 2,selectIndex: 1, type: 'hiragana'}]
      // 平假名多选数组 ji ['じ', 'ぢ']
      handleChoose (item, index, wordIndex) {
        console.log(item, index)
        this.showRecommend = false
        let newWord = {
          type       : 'hiragana',
          selectIndex: index,
          wordIndex
        }
        this.cachedWords.push(newWord)

        debugger
        this.inputKey()
        this.$nextTick(() => {
          this.$refs.textarea.focus()
        })
      },
      _validateWord (event) {
        if (!event) {
          return true
        } else if (event.data === ' ') {
          return false
        } else if (event.inputType === 'deleteContentBackward') {
          return false
        } else {
          return true
        }
      },
      _handleDoSthByKey () {
        // dosth
      },
      // 获取多值平假名
      _getHiraganaMultipleChoiceList () {
        return this.dictionaryArr
                   .filter(item => Object.prototype.toString.call(item[1]) === '[object Array]')
                   .map((item) => { return {[`${item[0]}`]: item[1]} })
                   .reduce((total, item) => { return {...total, ...item} })
      },
      // 获取平假名枚举
      _getHiraganaDictionary () {
        return this.dictionaryArr
                   .filter(item => Object.prototype.toString.call(item[1]) === '[object String]')
                   .map(item => { return {[`${item[0]}`]: item[1]} })
                   .reduce((total, item) => {
                     return {...total, ...item}
                   })
      },
      // 获取片假名枚举
      _getKatakanaDictionary () {
        const katakanas = Object.values(dictionary.katakana)
        return katakanas.length > 0 ? katakanas
          .reduce((total, item) => {
            return {...total, ...item}
          }) : {}
      }
    }
  }
</script>

<style scoped>
  .showWrapper {
    margin: 0 auto;
    width: 400px;
  }

  textarea {
    width: 400px;
    height: 200px;
  }
</style>
