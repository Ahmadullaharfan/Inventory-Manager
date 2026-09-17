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
    id: 'products',
    title: 'Products',
    translate: 'MENU.PRODUCTS',
    type: 'item',
    icon: 'box',
    url: 'products'
  },

  {
    id: 'productCatagory',
    title: 'Product Catagory',
    translate: 'MENU.PRODUCTS_CATAGORY',
    type: 'item',
    icon: 'box',
    url:  'productCatagory'
  }
]
