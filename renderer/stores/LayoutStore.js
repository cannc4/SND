import {
  observable,
  action,
  computed,
  toJS
} from 'mobx'
import _ from 'lodash'

// nodejs connections
import api from '../utils/api'
import { save } from '../utils/keyFunctions'
import TokenStore from './TokenStore'
import UserStore from './UserStore'
class LayoutStore {
  isLoading;

  @observable layouts;

  @observable customs;

  constructor () {
    this.layouts = []
    this.customs = [
      [],
      [],
      [],
      []
    ]
    this.isLoading = true
  }

  @computed get getLayouts () {
    return this.layouts
  }

  @computed get getCustoms () {
    return this.customs
  }

  @action showLayout (specifier) {
    this.layouts.forEach(l => {
      if (l.i === specifier) l.isVisible = true
    })
  }

  @action hideLayout (specifier) {
    this.layouts.forEach(l => {
      if (l.i === specifier) l.isVisible = false
    })
  }

  isSlotEmpty (i) {
    return this.customs[i] !== undefined && this.customs[i].length === 0
  }

  @action loadCustom (i) {
    if (this.customs[i].length > 0) {
      this.layouts = this.customs[i]
    }
  }
  ;
  @action saveCustom (i) {
    this.customs[i] = this.layouts
  }

  @action deleteCustom (i) {
    if (this.customs[i]) { this.customs[i] = [] }
  }

  @computed get visibleLayouts () {
    return this.layouts.filter(l => l.isVisible === true)
  }

  @computed get allLayouts () {
    return this.layouts
  }

  // REMOVE
  @action gridParameters (specifier) {
    const item = this.layouts.filter(l => l.i === specifier)[0]
    return {
      i: item.i,
      x: item.x,
      y: item.y,
      h: item.h,
      w: item.w,
      isVisible: item.isVisible
    }
  };

  @action onLayoutChange (layout, layouts) {
    if (!this.isLoading) {
      const hiddenItems = _.differenceBy(this.layouts, layout, 'i')

      // Invisible Layouts
      _.forEach(hiddenItems, (i) => {
        i['isVisible'] = false
      })

      // Visible Layouts
      _.forEach(layout, (i) => {
        i['isVisible'] = true
      })

      this.layouts = _.concat(layout, hiddenItems)
    }
  }

  load () {
    // load layouts
    // console.log(' ## LOADING LAYOUTS...')
    const ctx = this
    this.isLoading = true

    const activeUser = UserStore.currentUser
    const accessToken = TokenStore.getToken

    if (!activeUser) {
      return api.post('/authentication', { strategy: 'jwt', accessToken })
        .then(action((response) => {
          // console.log(response)
          ctx.layouts = response.data.user.layouts
          ctx.customs = response.data.user.customs
          UserStore.currentUser = response.data.user
          ctx.isLoading = false
        }))
        .catch(function (error) {
          // console.error(' ## LayoutStore errors: ', error)
          ctx.isLoading = false
        })
    } else {
      ctx.layouts = activeUser.layouts
      ctx.customs = activeUser.customs
      ctx.isLoading = false
    }
  }

  @action reset () {
    this.layouts = [
      {
        i: 'composition',
        x: 16,
        y: 0,
        w: 8,
        h: 20,
        isResizable: true,
        minH: 5,
        minW: 5,
        isVisible: true
      },
      {
        i: 'graph',
        x: 16,
        y: 0,
        w: 8,
        h: 20,
        isResizable: true,
        minH: 5,
        minW: 5,
        isVisible: true
      },
      {
        i: 'mix',
        x: 16,
        y: 0,
        w: 8,
        h: 20,
        isResizable: true,
        minH: 5,
        minW: 5,
        isVisible: true
      }
    ]
  }

  //   @action matFullscreen () {
  //     this.layouts = [
  //       {
  //         w: 17,
  //         h: 20,
  //         x: 0,
  //         y: 0,
  //         i: 'composition',
  //         moved: false,
  //         static: false,
  //         isVisible: true
  //       },
  //       {
  //         w: 17,
  //         h: 20,
  //         x: 0,
  //         y: 0,
  //         i: 'mix',
  //         minH: 2,
  //         minW: 2,
  //         moved: false,
  //         static: false,
  //         isVisible: true
  //       },
  //       {
  //         w: 7,
  //         h: 20,
  //         x: 17,
  //         y: 0,
  //         i: 'graph',
  //         minH: 2,
  //         minW: 2,
  //         moved: false,
  //         static: false,
  //         isVisible: true
  //       }
  //     ]
  //   }

  //   @action graphicsFullscreen () {

  //   }

  //   @action fullscreen (modelName) {
  //     if (this.layouts !== undefined) {
  //       let found = false
  //       _.forEach(this.layouts, (item, i) => {
  //         if (item.i === modelName) {
  //           item.x = 0
  //           item.y = 0
  //           item.w = 24
  //           item.h = 20
  //           item.isVisible = true
  //           found = true
  //         } else {
  //           item.isVisible = false
  //         }
  //       })

//       if (!found) {
//         this.layouts = _.concat(this.layouts, {
//           i: modelName,
//           x: 0,
//           y: 0,
//           w: 24,
//           h: 20,
//           isVisible: true
//         })
//       }
//     }
//   }
}

export default new LayoutStore()
