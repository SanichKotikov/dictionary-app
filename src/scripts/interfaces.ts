// APP

export interface PageOption {
    tplId: string;
    title: string;
    constructor: any
}


// DICT

export interface DictItem {
    id: string,
    timestamp: number,
    data: DictDataItem[],
}

export interface DictDataItem {
    pos: string;
    text: string;
    tr: DictDataTrItem[];
    ts: string;
}

export interface DictDataTrItem {
    gen?: string;
    asp?: string;
    ex?: DictDataTrExItem[];
    mean: DictDataTrMeanItem[];
    pos: string;
    syn?: DictDataTrSynItem[];
    text: string;
}

export interface DictDataTrExItem {
    text: string;
    tr: DictDataTrMeanItem[]; // TODO:
}

export interface DictDataTrMeanItem {
    text: string;
}

export interface DictDataTrSynItem {
    asp?: string;
    pos: string;
    text: string;
}


// LEARN

export interface learnAnswer {
    correct: boolean;
    dict: DictItem;
}
