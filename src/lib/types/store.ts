export type TStoreKey<TMap, TMapKey extends keyof TMap> = TMapKey
export type TStoreValue<TMap, TMapKey extends keyof TMap> = TMap[TMapKey]
export type TStorePartial<TMap, TMapKey extends keyof TMap> = Partial<
  TMap[TMapKey]
>
export type TStoreConstructor<TMap> = {
  initialMap?: Map<keyof TMap, TMap[keyof TMap]>
  fallbackValue?: TMap[keyof TMap]
}
