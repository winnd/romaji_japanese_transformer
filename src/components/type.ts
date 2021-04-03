// export declare type inputCache = {
//     key: string,
//     value: string | string[],
//     wordIndex: number
// }

/**
 * 用户输入的文本转换内容
 */
export interface InputWord {
    key: string,              // 罗马字
    value: string | string[], // 片假名|供选择的片假名
    wordIndex?: number        // 当前罗马字在句中的位置
}

/**
 * 罗马字到片假名的转换隐射
 */
export interface RomajiMap {
    wordIndexInSentence: number,  // 当前罗马字在句中的位置
    selectedIndex: number, // 用户选了哪个片假名
    katakanaText: string        // 罗马音对应的平假名文字
}
