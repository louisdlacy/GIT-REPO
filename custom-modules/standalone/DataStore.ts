/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */

/**
  This script is used to find shared data by name. 
 */

class DataStore {
  datas = new Map<string, any>()

  getAllData() {
    return this.datas
  }

  getData(key: string) {
    return this.datas.get(key)
  }

  setData(key: string, data: any) {
    this.datas.set(key, data)
  }
}
export const dataStore = new DataStore()
