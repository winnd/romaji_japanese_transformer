<template>
  <div class='hello'>
    <p>
      <a href="http://www.earth.sinica.edu.tw/webearth-library.../files/JP.htm"
         target="_blank"
      >五十音图参考表</a></p>
    <p class='showWrapper'>
      <template v-for="(item, index) in sentence">
        <span :key="index">{{item.transformedWord}}</span>
      </template>
    </p>

    <p>请在下方输入要转换的罗马音并以空格间隔</p>
    <textarea @input='inputKey2'
              v-model="inputStr"
              ref="textarea"
              @focus="handleFocus"
    ></textarea>

    <p>
      <button @click="change">转片假名</button>
    </p>

    <Select :list="recommendList"
            :show="showRecommend"
            :editingWordIndex="editingWordIndex"
            @onChoose="handleChoose"
    />

  </div>
</template>

<script>
  import dictionary from '../wordList.json'
  import Select from '@/components/select/Select'

  export default {
    name      : 'HelloWorld',
    components: {Select},
    data () {
      return {
        inputStr                  : '',      // 输入的罗马音 ji
        currentWord               : [],              // 当前正在输入的文字
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
        hiraganaMultipleChoiceList: [          // 一个发音对应多个值的组
          // {'ji': ['じ', 'ぢ']}
          // {"ceshi", ["ce", "shi", "ttt"]}
        ],
        hiraganaDictionary        : {         // 平假名
          // {'a':'あ',i: "い"}
        },
        katakanaDictionary        : {         // 片假名
                                              // {あ: "ア", い: "イ"}
        },
        sentence                  : [          // 整段话,每个单词（如:ji）为一个单元
          // {
          // originWord     : word,         // 原始输入 如: ji
          // type           : 'hiragana',   // 默认是平假名
          // hiraganaWord, // 平假名
          // indexInSentence: index,        // 该单词在句子中的索引 r_ 可能用不到
          // transformedWord: hiraganaWord || word,           // 最后要显示的单词 如: イ
          // selected       : false         // 是否被选中高亮
          // }
        ],
        showRecommend             : false,    // 显示推荐
        recommendList             : ['じ', 'ぢ'], // 推荐列表 如 ["じ","ぢ"]
        showKatakana              : false,    // 转为片假名
        editingWordIndex          : undefined // 当前正在输入的文字的索引
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

      // this.inputKey()   // 初始化
    },
    methods   : {
      inputKey2 (event) {
        // 复制而来
        if (event.inputType === 'insertFromPaste') {
          this.inputKey()
        }

        // 在字内部输入字母有问题 todo
        if (event.data !== ' ') {
          this.currentWord.push(event.data)
        }
        // 点击退格键操作
        if (event.inputType === 'deleteContentBackward') {
          const textarea = this.$refs.textarea
          const startPoint = textarea.selectionStart
          const endPoint = textarea.selectionEnd

          debugger
          //  && this.inputStr[startPoint - 1] !== ' '
          if (startPoint === endPoint) {
            const targetWord = this.sentence.find(
              x => x.originWordIndex >= startPoint && x.originWordIndex + x.originWord.length > endPoint
            )

            // targetWord 没找到值 可能是回车或空格
            if (!targetWord) return false

            const targetWordIndex = targetWord.indexInSentence

            if (targetWord.originWord.length === 1) {
              this.sentence.splice(targetWordIndex, 1)
              this.currentWord = []
            } else {
              let tmpSentenceArr = this.inputStr
                                       .trim().replace(/[\n]/g, ' ').split(' ').filter(x => x) // 整理新输入的数组
              let newOriginWord = tmpSentenceArr[targetWordIndex]       // 新输入的单词
              let hiragana = this.hiraganaDictionary[newOriginWord]     // 查找是否有对应片假名

              this.$set(this.sentence[targetWordIndex], 'originWord', newOriginWord)
              this.$set(this.sentence[targetWordIndex], 'transformedWord', hiragana || newOriginWord)
              this.currentWord = newOriginWord.split('')
            }
          }

          return false
        }

        const originWord = this.currentWord.join('')
        const hiraganaWord = this.hiraganaDictionary[originWord]

        let word = {
          originWord     : originWord,                  // 原始输入 如: ji
          type           : 'hiragana',                  // 默认是平假名
          hiraganaWord   : hiraganaWord,                // 平假名
          katakanaWord   : '',                          // 片假名 默认为空
          indexInSentence: this.sentence.length - 1,      // 该单词在句子中的索引
          originWordIndex: this.inputStr.length - 1,      // 输入的字母的索引
          transformedWord: hiraganaWord || originWord,  // 最后要显示的单词 如: イ
          selected       : false                        // 是否被选中高亮
        }
        if (event.data !== ' ') {
          // 输入第一个数时要特殊处理
          if (this.sentence.length === 0) {
            this.editingWordIndex = 0
            word.indexInSentence = 0          // 在输入第一个数的时候会是-1 所以要手动改
            this.sentence.push(word)
          } else {
            if (!this.sentence[this.editingWordIndex]) {
              word.indexInSentence++
              this.sentence.push(word)
            } else {
              if (this.hiraganaMultipleChoiceList[word.originWord]) {
                this.showRecommend = true
                this.editingWordIndex = word.indexInSentence
              } else {
                this.sentence.splice(this.editingWordIndex, 1, word)
              }
            }
          }
        } else {
          this.currentWord = []
          this.editingWordIndex = this.editingWordIndex + 1    // 要新增或修改的
        }
      },
      async inputKey () {
        this.sentence = [] // 清空句子

        // 组装句子
        let sentenceArr = this.inputStr.trim()
                              .replace(/[\n]/g, ' ')
                              .split(' ')
                              .filter(x => x) // 过滤多余的空字符串

        // 复制粘贴过来进行翻译的
        let sentenceTemp = sentenceArr.map((word, index) => {
          const hiraganaWord = this.hiraganaDictionary[word]

          return {
            originWord     : word,         // 原始输入 如: ji
            type           : 'hiragana',   // 默认是平假名
            hiraganaWord, // 平假名
            indexInSentence: index,        // 该单词在句子中的索引 r_ 可能用不到
            transformedWord: hiraganaWord || word,           // 最后要显示的单词 如: イ
            selected       : false         // 是否被选中高亮
          }
        })

        this.sentence = sentenceTemp
      },
      // 转为片假名
      change (event) {

      },
      // this.cacheWords: [{wordIndex: 2,selectIndex: 1, type: 'hiragana'}]
      // 平假名多选数组 ji ['じ', 'ぢ']
      handleChoose (katakanaStr, index, wordIndex) {
        console.log(katakanaStr, index, wordIndex)
        this.sentence[wordIndex].type = 'katakana'
        this.sentence[wordIndex].transformedWord = katakanaStr
        this.showRecommend = false
        this.$nextTick(() => {
          this.$refs.textarea.focus()
        })
      },
      handleFocus (a, b, c) {
        console.log(a, b, c)
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
  .showWrapper { margin: 0 auto; width: 400px; }

  textarea { width: 400px; height: 200px; }
</style>
