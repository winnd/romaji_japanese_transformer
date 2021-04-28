<template>
  <div class="hello">
    <div class="guide-wrapper">
      <header class="guide--title">使用方法
        <ul class="guide--box">
          <li>1. 手动输入 <img src="../assets/img/input_example.gif" alt="演示"></li>
          <li>2. 复制粘贴</li>
        </ul>
      </header>
    </div>

    <section>
      <div class="left">
        <p><label for="transform">平假名</label></p>
        <pre class="output-wrapper">{{ outputStr }}</pre>
      </div>
      <div class="center">
        <p><label for="transform">请在下方输入要转换的罗马音并以空格间隔</label></p>
        <textarea class="textarea" id="transform" ref="textareaDom" v-model="inputStr" @keyup="doKeyup"
                  @paste="doPaste"></textarea>
        <SelectMenu v-if="showSelectMenu" :item="katakanaToChoose" @chooseWord="doChooseWord"/>
      </div>
      <div class="right">
        <p><label for="transform">片假名</label></p>
        <pre class="output-wrapper">{{ outputStr }}</pre>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import JP_DICT from '../assets/data/wordMap.json'
import SelectMenu from '../components/SelectMenu.vue'
import { nextTick, ref } from 'vue'
import { InputWord, RomajiMap } from '../components/type'

export default {
  name: '输入区',
  components: { SelectMenu },
  setup() {
    const { hiragana: HIRAGANA_DICT, katakana: KATAKANA_DICT } = JP_DICT    // HIRAGANA_DICT: 平假名字典；KATAKANA_DICT: 片假名字典
    const multipleChooseWord = Object.entries(HIRAGANA_DICT).filter(x => x[1] instanceof Array)   // 有多个选择的罗马音， 如：ji,shi
    const inputStr = ref('')        // 用户的输入
    const outputStr = ref('')       // 显示到页面上的内容
    const textareaDom = ref(null)
    const showSelectMenu = ref(false) // 是否显示罗马音多选菜单
    const katakanaToChoose = ref({})    // 待选罗马音
    let wordsStore: RomajiMap[] = []     // 罗马音映射文本 ① 可以多选的罗马音 ② 回车符
    let inputWords: InputWord[] = []

    const doKeyup = (event: KeyboardEvent) => {
      const keyCode = event.code
      console.log('输入的键:', keyCode)
      switch (keyCode) {
        case '删除':
          // todo 需要测试
          break
        default:
          continueInput()
      }
    }

    const doPaste = () => {
      continueInput()
    }

    const continueInput = () => {
      const wordList = inputStr.value   // 当前输入的内容
          .split(' ')         // 以空格为界进行分割
          .filter(x => !!x)             // 过滤为空字符串

      // 获取用户输入的文字映射
      console.log(getSelection())
      inputWords = wordList.map((romaji, wordIndex): InputWord => {
        return {
          key: romaji,
          value: _getValue(romaji, wordIndex),
          wordIndex: wordIndex,
        }
      })
      // // 用户输入的有多个平假名选项的的罗马音
      // const inputtedMultipleChooseRomaji: InputWord[] = inputWords.filter(x => x.value instanceof Array)
      //
      // // 未被记录的多选罗马字
      // const unStoreRomajiMap = inputtedMultipleChooseRomaji.filter(x => !wordsStore.find(y => x.wordIndex === y.wordIndexInSentence))
      //
      // // 维护 wordsStore 用户对于有多个选项的罗马音选了哪个结果。 如: ji 选了第0个
      // if (inputtedMultipleChooseRomaji.length && unStoreRomajiMap.length) {
      //   debugger
      //   showSelectMenu.value = true
      //   katakanaToChoose.value = unStoreRomajiMap[0]
      //   // katakanaToChoose.value = inputtedMultipleChooseRomaji[0]
      // }

      outputStr.value = _getOutPutStr(inputWords)
    }

    function _getValue(romaji: string, wordIndex: number): string {
      // 处理回车和多选的情况
      let _romaji = romaji
      if (romaji.includes('\n')) {
        // 处理回车
        const _item = romaji.split('\n')
        _romaji = _item.map(_romaji => _getKatakana(_romaji, wordIndex)).join('\n')
      } else {
        _romaji = _getKatakana(romaji, wordIndex)
      }
      return _romaji
    }

    // 处理多选
    function _getKatakana(romaji, wordIndex) {
      if (HIRAGANA_DICT[romaji] instanceof Array) {
        const wordInSentence = wordsStore.find(x => x.wordIndexInSentence === wordIndex)
        if (wordInSentence) {
          return romaji[wordInSentence.selectedIndex]
        } else {
          // todo 插标, 这里要做高亮选择
          return `这是默认值${ HIRAGANA_DICT[romaji][0] }`
        }
      } else {
        return HIRAGANA_DICT[romaji] || romaji
      }
    }

    // 获得可以输出的文本
    const _getOutPutStr = (katakanaWords: InputWord[]): string => {
      const resultWordList: string[] = katakanaWords.map((katakanaWord: InputWord) => {
        // debugger
        if (HIRAGANA_DICT[katakanaWord.key] instanceof Array) {
          const romajiStore: RomajiMap = wordsStore.find(romaji => katakanaWord.wordIndex === romaji.wordIndexInSentence)
          return romajiStore?.katakanaText || `${ '__ ?? __' }` // todo 处理数组          // todo 插标, 这里要做高亮选择
        } else {
          return (katakanaWord.value) as string
        }
      })
      return resultWordList.join('')
    }

    /**
     * 在<selectMenu/> 组件中点击回车确认选择平假名
     * @param selectedKatakanaObj{RomajiMap} 选中的片假名对象
     */
    const doChooseWord = (selectedKatakanaObj: RomajiMap) => {
      showSelectMenu.value = false
      const reduplicateIndex = wordsStore.findIndex(x => x.wordIndexInSentence === selectedKatakanaObj.wordIndexInSentence)
      // 把输入的值在 wordstore 里缓存起来
      if (reduplicateIndex > -1) {
        wordsStore.splice(reduplicateIndex, 1, selectedKatakanaObj)
      } else {
        wordsStore.push(selectedKatakanaObj)
      }
      outputStr.value = _getOutPutStr(inputWords)
      nextTick(() => {
        textareaDom.value.focus()
      })
    }

    return {
      inputStr,
      outputStr,
      textareaDom,
      showSelectMenu,
      katakanaToChoose,
      doKeyup,
      doPaste,
      doChooseWord,
    }
  },
}


</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang="scss">
$text-height: 400px;

.guide-wrapper {
  position: relative;
  display: inline-block;

  header.guide--title {
    cursor: pointer;
    color: rgb(2, 121, 215);
    display: inline-block;
    padding: 0 5px;

    &:hover {
      .guide--box {
        display: inline-block;
      }
    }
  }

  ul.guide--box {
    position: absolute;
    top: 100%;
    left: calc(100% - 10px);
    transform: translateX(-50%);
    display: none;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    background: #eeeeee;
    font-size: 14px;
    cursor: initial;

    li {
      padding: 4px;
      margin: 0 8px;
      word-break: keep-all;
      white-space: pre;
      text-align: left;
      display: flex;

      &:first-child {
        border-bottom: 1px solid #ccc;
      }

      img {
        display: block;
        max-width: initial;
        width: 900px;
      }
    }
  }
}

section {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-top: 20px;

  .left {
    height: 100%;
    background: orchid;
  }

  .center {
    background: orange;
  }

  .right {
    height: 100%;
    background: yellowgreen;
  }
}

.output-wrapper {
  margin: 0 auto;
  width: 400px;
}

.textarea {
  width: 400px;
  height: $text-height;
  outline: none;
  border: 1px solid #eee;
}
</style>
