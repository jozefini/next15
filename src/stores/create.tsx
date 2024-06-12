import type {
  TFunction,
  TStoreConstructor,
  TStoreKey,
  TStorePartial,
  TStoreValue,
} from '@/lib/types'
import { useCallback, useRef, useSyncExternalStore } from 'react'

export class CreateStore<TMap> {
  private map = new Map<keyof TMap, TMap[keyof TMap]>()
  private itemSubscribers = new Map<keyof TMap, Set<() => void>>()
  private sizeSubscribers = new Set<() => void>()
  private keysSubscribers = new Set<() => void>()
  private filteredKeysSubscribers = new Set<() => void>()
  private fallbackValue?: TMap[keyof TMap]

  // Constructor

  constructor(props?: TStoreConstructor<TMap>) {
    this.map = props?.initialMap || new Map()
    this.fallbackValue = props?.fallbackValue
  }

  // Sync

  public syncKeys = () => {
    const batch = this.keysSubscribers
    if (batch.size > 0) {
      setTimeout(() => {
        for (const callback of batch) {
          callback()
        }
      }, 0)
    }
  }

  public syncFilteredKeys = () => {
    const batch = this.filteredKeysSubscribers
    if (batch.size > 0) {
      setTimeout(() => {
        for (const callback of batch) {
          callback()
        }
      }, 0)
    }
  }

  public syncSize = () => {
    const batch = this.sizeSubscribers
    if (batch.size > 0) {
      setTimeout(() => {
        for (const callback of batch) {
          callback()
        }
      }, 0)
    }
  }

  public syncItem = (key: keyof TMap | (keyof TMap)[]) => {
    const keys = !Array.isArray(key) ? [key] : key
    let batch: TFunction[] = []

    for (const key of keys) {
      const subscribers = this.itemSubscribers.get(key as keyof TMap)
      if (subscribers) {
        batch = batch.concat(...subscribers)
      }
    }

    if (batch.length > 0) {
      setTimeout(() => {
        for (const callback of batch) {
          callback()
        }
      }, 0)
    }
  }

  public syncMap = () => {
    const batch: TFunction[] = []

    for (const callbacks of this.itemSubscribers.values()) {
      for (const callback of callbacks) {
        batch.push(callback)
      }
    }

    if (batch.length > 0) {
      setTimeout(() => {
        for (const callback of batch) {
          callback()
        }
      }, 0)
    }
  }

  // Getters

  public getMap = () => {
    return this.map as Map<keyof TMap, TMap[keyof TMap]>
  }

  public getItem = <TMapKey extends keyof TMap>(
    key: TStoreKey<TMap, TMapKey>
  ) => {
    if (!this.map.has(key)) {
      return this.fallbackValue as TStoreValue<TMap, TMapKey>
    }
    return this.map.get(key) as TStoreValue<TMap, TMapKey>
  }

  public getSize = () => {
    return this.map.size as number
  }

  public getKeys = (filter?: (_: TMap[keyof TMap]) => boolean) => {
    if (!filter) {
      return Array.from(this.map.keys()) as (keyof TMap)[]
    }
    const keys: (keyof TMap)[] = []
    for (const [key, value] of this.map.entries()) {
      if (filter(value)) {
        keys.push(key)
      }
    }
    return keys
  }

  // Actions

  public setItem = <TMapKey extends keyof TMap>(
    key: TStoreKey<TMap, TMapKey>,
    item: TMap[TStoreKey<TMap, TMapKey>],
    notify = true
  ) => {
    this.map.set(key, item)

    if (notify) {
      this.syncItem(key)
      this.syncSize()
      this.syncKeys()
      this.syncFilteredKeys()
    }
  }

  public setMap = (map: Map<keyof TMap, TMap[keyof TMap]>, notify = true) => {
    this.map = map
    if (notify) {
      this.itemSubscribers.clear()
      this.sizeSubscribers.clear()
      this.keysSubscribers.clear()
      this.filteredKeysSubscribers.clear()
      this.syncMap()
      this.syncSize()
      this.syncKeys()
      this.syncFilteredKeys()
    }
  }

  public updateItem = <TMapKey extends keyof TMap>(
    key: TStoreKey<TMap, TMapKey>,
    item: Partial<TMap[TMapKey]> | ((_: TMap[TMapKey]) => TMap[TMapKey]),
    notify = true
  ) => {
    if (!this.map.has(key as keyof TMap)) {
      return
    }

    const data: TMap[TMapKey] | undefined = this.map.get(
      key as keyof TMap
    ) as TMap[TMapKey]
    if (typeof item === 'function') {
      this.map.set(
        key as keyof TMap,
        (item as (arg: TMap[TMapKey]) => TMap[TMapKey])(
          typeof data === 'object' && data !== null && !Array.isArray(data)
            ? { ...data }
            : data
        )
      )
    } else if (
      typeof item === 'object' &&
      item !== null &&
      !Array.isArray(item)
    ) {
      this.map.set(key as keyof TMap, {
        ...data,
        ...item,
      })
    } else {
      this.map.set(key as keyof TMap, item as TMap[TMapKey])
    }

    if (notify) {
      this.syncItem(key as keyof TMap)
      this.syncFilteredKeys()
    }
  }

  public updateMap = <TMapKey extends keyof TMap>(
    map: TStorePartial<TMap, TMapKey>,
    notify = true
  ) => {
    const keys = Object.keys(map) as (keyof TMap)[]
    for (const key of keys) {
      this.updateItem(key, (map as TMap)[key], false)
    }
    if (notify) {
      this.syncItem(keys)
      this.syncFilteredKeys()
    }
  }

  public removeItem = (key: keyof TMap, notify = true) => {
    this.map.delete(key)
    if (notify) {
      this.syncItem(key)
      this.syncSize()
      this.syncKeys()
      this.syncFilteredKeys()
    }
  }

  // Subscribers

  public useItem = <TMapKey extends keyof TMap>(
    key: TStoreKey<TMap, TMapKey>
  ) => {
    const prevItem = useRef<TMap[TMapKey] | undefined>(undefined)
    const subscribe = useCallback(
      (callback: () => void) => {
        let subscribers = this.itemSubscribers.get(key)
        if (subscribers) {
          subscribers.add(callback)
        } else {
          subscribers = new Set([callback])
          this.itemSubscribers.set(key, subscribers)
        }
        return () => {
          if (subscribers) {
            subscribers.delete(callback)
            if (subscribers.size === 0) {
              this.itemSubscribers.delete(key)
            }
          }
        }
      },
      [key]
    )
    const snapshot = useCallback(() => {
      const currentItem = this.map.has(key)
        ? this.map.get(key)
        : this.fallbackValue
      if (!Object.is(currentItem, prevItem.current)) {
        prevItem.current = currentItem as TMap[TMapKey]
      }
      return currentItem
    }, [key])

    return useSyncExternalStore(subscribe, snapshot, snapshot) as TStoreValue<
      TMap,
      TMapKey
    >
  }

  public useSize = () => {
    const prevSize = useRef<number>(0)
    const subscribe = useCallback((callback: () => void) => {
      this.sizeSubscribers.add(callback)
      return () => {
        this.sizeSubscribers.delete(callback)
      }
    }, [])
    const snapshot = useCallback(() => {
      const currentSize = this.map.size
      if (currentSize !== prevSize.current) {
        prevSize.current = currentSize
      }
      return currentSize
    }, [])

    return useSyncExternalStore(subscribe, snapshot, snapshot)
  }

  public useKeys = (filter?: (_: TMap[keyof TMap]) => boolean) => {
    const prevKeys = useRef<(keyof TMap)[]>([])
    const subscribe = useCallback(
      (callback: () => void) => {
        if (filter) {
          this.filteredKeysSubscribers.add(callback)
        } else {
          this.keysSubscribers.add(callback)
        }
        return () => {
          if (filter) {
            this.filteredKeysSubscribers.delete(callback)
          } else {
            this.keysSubscribers.delete(callback)
          }
        }
      },
      [filter]
    )
    const snapshot = useCallback(() => {
      const currentKeys = this.getKeys(filter)
      if (
        currentKeys.length !== prevKeys.current.length ||
        !prevKeys.current.every((key, i) => key === currentKeys[i])
      ) {
        prevKeys.current = currentKeys
      }
      return prevKeys.current
    }, [filter])

    return useSyncExternalStore(subscribe, snapshot, snapshot)
  }
}
