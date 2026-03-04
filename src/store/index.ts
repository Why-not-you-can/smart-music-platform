import { configureStore } from '@reduxjs/toolkit'
import { useSelector, TypedUseSelectorHook, useDispatch } from 'react-redux'
import recommendReducer from '../views/discover/c-views/recommend/store/recommend'
import playerReducer from '../views/player/store/player'
import rankingReducer from '../views/discover/c-views/ranking/store/ranking'
import songReducer from '../views/discover/c-views/songs/store/song'
import djradioReducer from '../views/discover/c-views/djradio/store/djradio'
import singerReducer from '../views/discover/c-views/singger/store/singer'
import albumReducer from '../views/discover/c-views/album/store/album'
const store = configureStore({
  reducer: {
    recommend: recommendReducer,
    player: playerReducer,
    ranking: rankingReducer,
    song: songReducer,
    djradio: djradioReducer,
    singer: singerReducer,
    album: albumReducer
  }
})

type GetStateFnType = typeof store.getState
export type IRootState = ReturnType<GetStateFnType>
type DispatchType = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector
export const useAppDispatch: () => DispatchType = useDispatch
export default store
