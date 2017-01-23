
export interface dictItem {
    id: string,
    timestamp: number,
    data: dictDataItem[],
}

export interface dictDataItem {
    pos: string;
    text: string;
    tr: dictDataTrItem[];
    ts: string;
}

export interface dictDataTrItem {
    gen?: string;
    asp?: string;
    ex?: dictDataTrExItem[];
    mean: dictDataTrMeanItem[];
    pos: string;
    syn?: dictDataTrSynItem[];
    text: string;
}

export interface dictDataTrExItem {
    text: string;
    tr: dictDataTrMeanItem[]; // TODO:
}

export interface dictDataTrMeanItem {
    text: string;
}

export interface dictDataTrSynItem {
    asp?: string;
    pos: string;
    text: string;
}
