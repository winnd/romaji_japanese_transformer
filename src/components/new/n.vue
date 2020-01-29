<template>
  <div class='hello'>
    <p>
      <a href="http://www.earth.sinica.edu.tw/webearth-library.../files/JP.htm"
         target="_blank"
      >五十音图参考表</a></p>
    <p class='showWrapper'>
      <template v-for="(item,index) in transformedWord">
        <span :key="index">{{item.transformedWord}}</span>
      </template>
    </p>

    <p>请在下方输入要转换的罗马音并以空格间隔</p>
    <textarea @input='inputKey' v-model="inputStr" @select="handleSelect"
    ></textarea>

    <p>
      <button @click="change">转片假名</button>
    </p>
    <!--todo 选择字符 转为平假名-->
    <!--todo 平假名片假名-->
    <!--todo 固定中间的显示转换后文字的区块-->
    <!--todo 浊音 圈圈 和点-->
  </div>
</template>

<script>
  import dictionary from '../wordList.json'

  export default {
    name   : 'HelloWorld',
    data () {
      return {
        dictionaryArr  : [          // dictionary数据扁平化,数组化
          // ['ji', ['じ', 'ぢ']]
        ],
        arrCache       : [      // 一个发音对应多个值的组
          // ['ji', ['じ', 'ぢ']]
        ],
        hiraganaCache  : [      // 一个发音对应多个值的组 平假名
          // ['a','あ']
        ],
        katakanaCache  : [      // 片假名
          // ['1',]
        ],
        transformedWord: [          // 每个单词（如:ji）为一个单元
          // {
          //   selected      : '',   // 是否高亮
          //   wordIndexInArr: 0,    // 该组中的索引 ji 【0，1】
          //   originWord    : '',   // 输入的单词
          //   transformWord : ''    // 转换后的单词
          // }
        ],
        inputStore     : [      // 缓存
          // {
          // wordIndex  : 2,    // 第几个单词被缓存(如:第三个单词是ji
          // selectIndex: 1     // 第几个选项(如选了ji的第2个选项
          // }
        ],
        inputStr       : '',      // 输入的罗马音 ji
        selectedIndex  : 0,       // 该单词的位置
        showRecommend  : false,    // 显示推荐
        showKatakana   : false    // 转为片假名
      }
    },
    created () {
      // 对数据进行整理, 如果是数组则暂存
      this.dictionaryArr = Object.entries(dictionary)

      // this.arrCache = this.dictionaryArr
      //                     .filter(item => Object.prototype.toString.call(item[1]) === '[object Array]')

      this.katakanaCache = dictionary.katakana.map(x => {

      })
      this.hiraganaCache = this.dictionaryArr
                               .filter(item => Object.prototype.toString.call(item[1]) === '[object String]')
    },
    methods: {
      async inputKey (event) {
        const validated = await this._validateWord(event.data)

        if (!validated) { return false }

        this.transformedWord = []

        let textAreaStrArr =
              this.inputStr
                  .trim()
                  .split(' ')                   // 按空格分割为数组
                  .filter(x => x)                        // 过滤多余的空字符串
                  .map((item) => {
                    return {
                      selected       : false,
                      originWord     : item,
                      wordIndexInArr : 0,
                      transformedWord: ''
                    }
                  })

        // 一个发音对应一组值 this.inputStore是缓存
        if (this.inputStore.length > 0) {
          this.inputStore.map((item, index) => {
            textAreaStrArr[item.wordIndex].wordIndexInArr = index
            textAreaStrArr[item.wordIndex].transformedWord = item[0]
          })
        }

        // 一个发音对应一个值 this.inputStore是缓存
        this.transformedWord =
          textAreaStrArr
            .filter(x => x.transformedWord === '')
            .map(x => {
              const foundWord =
                      this.hiraganaCache
                          .find(y => y[0] === x.originWord)   // 是否找到对应的值
              x.transformedWord = foundWord ? foundWord[1] : x.originWord
              return x
            })
      },
      change (event) {

      },
      handleSelect (event) {
        debugger
        console.log(event)
        let selectedText = document.getSelection().toString()
        if (selectedText.length === 0) {
          // todo 转换片假名
          this.showKatakana = true
        }
      },
      _validateWord (str) {
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
