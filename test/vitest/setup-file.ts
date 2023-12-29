// This file will be run before each test file
import { vi } from 'vitest'

class LocalStorageMock {
  protected store:{ [key: string]: string; }

  constructor() {
    this.store = {}
  }

  clear() {
    this.store = {}
  }

  getItem(key: string):any {
    return this.store[key] || null
  }

  setItem(key:string, value:any) {
    this.store[key] = String(value)
  }

  removeItem(key:string) {
    delete this.store[key]
  }
}

vi.stubGlobal('localStorage', LocalStorageMock)
