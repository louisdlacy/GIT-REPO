"use strict";
/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataStore = void 0;
/**
  This script is used to find shared data by name.
 */
class DataStore {
    constructor() {
        this.datas = new Map();
    }
    getAllData() {
        return this.datas;
    }
    getData(key) {
        return this.datas.get(key);
    }
    setData(key, data) {
        this.datas.set(key, data);
    }
}
exports.dataStore = new DataStore();
