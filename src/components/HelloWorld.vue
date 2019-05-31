<template>
  <div class='hello'>
    <p>
      <a href="http://www.earth.sinica.edu.tw/webearth-library.../files/JP.htm" target="_blank">五十音图参考表</a></p>
    <p class='showWrapper'>
      <template v-for="(item,index) in inputWord">
        <span :key="index">{{item.value}}</span>
      </template>
    </p>

    <p><label for='transform'>请在下方输入要转换的罗马音并以空格间隔</label></p>
    <textarea name='input' id='transform' class="textarea" ref="textarea"
              @input='inputKey'
              v-model="textAreaStr"
    ></textarea>

    <label>
    <Select :list="a.ji"
            v-if="showRecommend"
            :selectedIndex="selectedIndex"
            @callback="selectedText"
    ></Select>
      <!--:selectedIndex="selectedIndex"-->
    </label>
  </div>
</template>

<script>
  // import a from './key_value.json'
  import Select from './select/Select'

  export default {
    created () {},
    name      : 'HelloWorld',
    data () {
      return {
        inputWord    : [],          // 输入内容与对应关系
        textAreaStr  : '',          // 输入的罗马音 ji
        selectedIndex: 0,          // 该单词的位置
        showRecommend: false,       // 显示下拉选框 flag
        // selectedIndex: 0,          // 需要选择的罗马文的index
        a            : {
          'a'  : 'あ',
          'i'  : 'い',
          'u'  : 'う',
          'e'  : 'え',
          'o'  : 'お',
          'ka' : 'か',
          'ki' : 'き',
          'ku' : 'く',
          'ke' : 'け',
          'ko' : 'こ',
          'sa' : 'さ',
          'shi': 'し',
          'su' : 'す',
          'se' : 'せ',
          'so' : 'そ',
          'ta' : 'た',
          'chi': 'ち',
          'tsu': 'つ',
          'te' : 'て',
          'to' : 'と',
          'na' : 'な',
          'ni' : 'に',
          'nu' : 'ぬ',
          'ne' : 'ね',
          'no' : 'の',
          'ha' : 'は',
          'hi' : 'ひ',
          'hu' : 'ふ',
          'he' : 'へ',
          'ho' : 'ほ',
          'ma' : 'ま',
          'mi' : 'み',
          'mu' : 'む',
          'me' : 'め',
          'mo' : 'も',
          'ya' : 'や',
          'yu' : 'ゆ',
          'yo' : 'よ',
          'ra' : 'ら',
          'ri' : 'り',
          'ru' : 'る',
          're' : 'れ',
          'ro' : 'ろ',
          'wa' : 'わ',
          'n'  : 'ん',
          'wo' : 'を',
          'ga' : 'が',
          'gi' : 'ぎ',
          'gu' : 'ぐ',
          'ge' : 'げ',
          'go' : 'ご',
          'za' : 'ざ',
          'zu' : 'ず',
          'ze' : 'ぜ',
          'zo' : 'ぞ',
          'da' : 'だ',
          'ji' : ['じ', 'ぢ'],
          'du' : 'づ',
          'de' : 'で',
          'do' : 'ど',
          'ba' : 'ば',
          'bi' : 'び',
          'bu' : 'ぶ',
          'be' : 'べ',
          'bo' : 'ぼ',
          'pa' : 'ぱ',
          'pi' : 'ぴ',
          'pu' : 'ぷ',
          'pe' : 'ぺ',
          'po' : 'ぽ',
          'kya': 'きゃ',
          'kyu': 'きゅ',
          'kyo': 'きょ',
          'sha': 'しや',
          'shu': 'しゅ',
          'sho': 'しよ',
          'cha': 'ちゃ',
          'chu': 'ちゅ',
          'cho': 'ちよ',
          'nya': 'にあ',
          'nyu': 'にゆ',
          'nyo': 'によ',
          'hya': 'ひや',
          'hyu': 'ひゆ',
          'hyo': 'ひよ',
          'mya': 'みや',
          'myu': 'みゅ',
          'myo': 'みよ',
          'rya': 'りや',
          'ryu': 'りゅ',
          'ryo': 'りよ',
          'gya': 'ぎや',
          'gyu': 'ぎゅ',
          'gyo': 'ぎよ',
          'ja' : 'じや',
          'ju' : 'じゅ',
          'jo' : 'じよ',
          'bya': 'びや',
          'byu': 'びゅ',
          'byo': 'びよ',
          'pya': 'ぴや',
          'pyu': 'ぴゅ',
          'pyo': 'ぴよ',
          'k'  : {
            'ka': 'か',
            'ki': 'き',
            'ku': 'く',
            'ke': 'け',
            'ko': 'こ'
          },
          's'  : {
            'sa' : 'さ',
            'shi': 'し',
            'su' : 'す',
            'se' : 'せ',
            'so' : 'そ'
          },
          '3'  : {
            'あ': 'ア',
            'い': 'イ',
            'う': 'ウ',
            'え': 'エ',
            'お': 'オ'
          },
          '4'  : {
            'か': 'カ',
            'き': 'キ',
            'く': 'ク',
            'け': 'ケ',
            'こ': 'コ',
            'さ': 'サ',
            'し': 'シ',
            'す': 'ス',
            'せ': 'セ',
            'そ': 'ソ'
          }
        }
      }
    },
    methods   : {
      createFilter (queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      inputKey (event) {
        console.log(event)
        if (event.data !== ' ' && event.data !== 'deleteContentBackward') {
          var oldInputWord   = this.inputWord.filter(x => {
            return x.wordIndexInArr !== undefined      // 有index的要存下来
          })
          this.inputWord     = []
          var textAreaStrArr = this.textAreaStr.trim().split(' ')                   // 分割为数组
          textAreaStrArr     = textAreaStrArr.filter(x => { return x !== '' })      // 过滤为空的
          textAreaStrArr.map(x => {
            let obj = {}
            obj.key = x
            this.inputWord.push(obj)
          })

          oldInputWord.map(x => {
            if (this.inputWord[x.index]) {
              this.inputWord[x.index].index          = x.index
              this.inputWord[x.index].wordIndexInArr = x.wordIndexInArr
              this.inputWord[x.index].value          = x.value
            }
          })

          // var key         = textAreaStrArr[textAreaStrArr.length - 1]   // 最后一个word
          console.log(this.inputWord)
          this.inputWord.map((x, i) => {
            if (x.index !== undefined && event.inputType !== 'deleteContentBackward') { return }
            if (x.key !== '') {
              switch (Object.prototype.toString.call(this.a[x.key])) {
                case '[object String]':
                  x.value            = this.a[x.key]
                  this.showRecommend = false
                  return x
                case '[object Array]':
                  // var target = this.textAreaStr.split(' ')[x.index] === x.key
                  var target = x.index === undefined ? false : (oldInputWord[x.index].key === x.key)
                  if (x.index !== undefined && !target) {              // 已经改过了 并且删除了一部分
                    delete x.index     // 归零
                    x.value = x.key
                  } else if (x.index !== undefined && target) {    // 未做改动, 保持原样
                  } else {        // 新加的 初始化
                    x.value            = x.key    // 默认value
                    x.index            = i
                    this.showRecommend = true
                  }
                  this.selectedIndex = x.index
                  return x
                default:
                  if (x.index) { delete x.index }
                  if (x.value) { delete x.value }
                  if (x.wordIndexInArr !== undefined) { delete x.wordIndexInArr }
                  x.value            = this.a[x.key] === undefined ? x.key : x.key
                  this.showRecommend = false
                  return x
              }
            }
          })
        }
      },
      selectedText (value, index, wordIndexInArr, otherKey) {
        if (value !== undefined) {
          this.showRecommend                   = false
          this.inputWord[index].wordIndexInArr = wordIndexInArr
          this.inputWord[index].value          = value[0]
        } else {
          // this.inputWord[index].value = otherKey
        }
        this.$refs.textarea.focus()
      }
    },
    components: {Select}
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
