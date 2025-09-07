/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */
/**
  This script is used to find shared data by name.
 */
declare class DataStore {
    datas: Map<string, any>;
    getAllData(): Map<string, any>;
    getData(key: string): any;
    setData(key: string, data: any): void;
}
export declare const dataStore: DataStore;
export {};
