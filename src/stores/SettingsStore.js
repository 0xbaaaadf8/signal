import { observable, computed, action } from "mobx"
import JsonStore from "helpers/electron-json-store"

export default class SettingsStore {
  @observable _soundFontPath

  constructor() {
    this.storage = new JsonStore()
    this._soundFontPath = this.storage.get("soundFontPath")
    console.log(`Setting was restored from ${this.storage.path}`)
  }

  set soundFontPath(path) {
    this._soundFontPath = path
    this.storage.set("soundFontPath", path)
  }

  @computed get soundFontPath() {
    return this._soundFontPath
  }

  @action clear() {
    this.storage.clear()
    this._soundFontPath = null
  }
}
