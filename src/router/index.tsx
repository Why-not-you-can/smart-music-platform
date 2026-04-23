import React, { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { RouteObject } from 'react-router-dom'

/* import Discover from '@/views/discover'
import Mine from '@/views/mine'
import Focus from '@/views/focus'
import Download from '@/views/download' */
const Discover = lazy(() => import('@/views/discover'))
const Recommend = lazy(() => import('@/views/discover/c-views/recommend'))
const Ranking = lazy(() => import('@/views/discover/c-views/ranking'))
const Songs = lazy(() => import('@/views/discover/c-views/songs'))
const Djradio = lazy(() => import('@/views/discover/c-views/djradio'))
const Singger = lazy(() => import('@/views/discover/c-views/singger'))
const Album = lazy(() => import('@/views/discover/c-views/album'))
const Mine = lazy(() => import('@/views/mine'))
const Player = lazy(() => import('@/views/player'))
const Playlist = lazy(() => import('@/views/playlist'))
const Personal = lazy(() => import('@/views/personal'))
const SongsList = lazy(() => import('@/views/songslist'))
const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/discover" />
  },
  {
    path: '/discover',
    element: <Discover />,
    children: [
      {
        path: '/discover',
        element: <Navigate to="/discover/recommend" />
      },
      {
        path: '/discover/recommend',
        element: <Recommend />
      },
      {
        path: '/discover/ranking',
        element: <Ranking />
      },
      {
        path: '/discover/songs',
        element: <Songs />
      },
      {
        path: '/discover/djradio',
        element: <Djradio />
      },
      {
        path: '/discover/singger',
        element: <Singger />
      },
      {
        path: '/discover/album',
        element: <Album />
      },
      {
        path: '/discover/player',
        element: <Player />
      },
      {
        path: '/discover/playlist',
        element: <Playlist />
      }
    ]
  },
  {
    path: '/mine',
    element: <Mine />
  },
  {
    path: '/personal',
    element: <Personal />
  },
  {
    path: '/songslist',
    element: <SongsList />
  }
]

export default routes
