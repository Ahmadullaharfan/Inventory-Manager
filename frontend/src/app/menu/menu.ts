import { CoreMenu } from '@core/types'

export const menu: CoreMenu[] = [
  {
    id: 'home',
    title: 'Home',
    translate: 'MENU.HOME',
    type: 'item',
    icon: 'home',
    url: 'home'
  },
  {
    id: 'sample',
    title: 'Sample',
    translate: 'MENU.SAMPLE',
    type: 'item',
    icon: 'file',
    url: 'sample'
  }
  ,
  {
    id: 'products',
    title: 'Products',
    translate: 'MENU.PRODUCTS',
    type: 'item',
    icon: 'box',
    url: 'products'
  }
]
