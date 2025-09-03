export type CUIRowData = {
    CUIId: string;
    enabled: Boolean;
    titleText: string;
    subTitleText: string;
    bodyText: string;
    logoAssetId: string;
};
export type CUIRecordData = {
    recordId: string;
    row: Array<CUIRowData>;
};
export declare var booFilterData: Boolean;
export declare var AssetReferenceRows: CUIRowData[];
export declare var AssetReferencesCount: number;
export declare var keyCount: number;
