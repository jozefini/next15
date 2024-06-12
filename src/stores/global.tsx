import { objectToMap } from '@/lib/utils'
import { CreateStore } from '@/stores/create'

type GlobalStates = {
  isNavOpen: boolean
}

export const globalStore = new CreateStore<GlobalStates>({
  initialMap: objectToMap<GlobalStates>({
    isNavOpen: false,
  }),
})
