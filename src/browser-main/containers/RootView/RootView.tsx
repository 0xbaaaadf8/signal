import React, { Fragment, StatelessComponent } from "react"
import { Helmet } from "react-helmet"
import path from "path"
import { observer, inject } from "mobx-react"
import DevTools from "mobx-react-devtools"

import TempoEditor from "containers/TempoEditor/TempoEditor"
import ArrangeView from "containers/ArrangeView/ArrangeView"
import TransportPanel from "containers/TransportPanel/TransportPanel"
import PianoRollEditor from "containers/PianoRollEditor/PianoRollEditor"
import SettingsView from "containers/SettingsView/SettingsView"

import Sidebar from "components/Sidebar/Sidebar"

import mainManu from "menus/mainMenu"
import isDev from "helpers/isDev"

import { compose } from "recompose"
import Song from "common/song"
import { Dispatcher } from "browser-main/createDispatcher"

import "./Resizer.css"
import "./RootView.css"

const { remote } = (window as any).require("electron")
const { Menu } = remote

interface RootViewProps {
  song: Song
  dispatch: Dispatcher
  routerPath: string
}

const RootView: StatelessComponent<RootViewProps> = ({
  song,
  dispatch,
  routerPath,
}) => {
  const { selectedTrack } = song

  const menu = mainManu(song, dispatch)
  Menu.setApplicationMenu(menu)

  const fileName = path.basename(song.filepath.replace(/\\/g, "/"))

  function withTransporter(content) {
    return <Fragment>
      <div className="content">
        {content}
      </div>
      <TransportPanel />
    </Fragment>
  }

  function router() {
    switch (routerPath) {
      case "/track": return selectedTrack.isConductorTrack ? withTransporter(<TempoEditor />) : withTransporter(<PianoRollEditor />)
      case "/settings": return <SettingsView />
      case "/arrange": /* fallthrough */
      default:
        return withTransporter(<Fragment>
          <Sidebar />
          <ArrangeView />
        </Fragment>)
    }
  }

  return <div className="RootView">
    <Helmet><title>{`${song.name} (${fileName}) ― signal`}</title></Helmet>
    {router()}
    {isDev() && <DevTools />}
  </div>
}

export default compose(
  inject(({ rootStore: { router: { path }, song, services: { player }, dispatch } }) => ({
    routerPath: path,
    song,
    player,
    dispatch
  })),
  observer,
)(RootView)
