
export const products = [
  {
    id: '20',
    createdAt: '27/03/2019',
    description: 'Dropbox is a file hosting service that offers cloud storage, file synchronization, a personal cloud.',
    media: '/static/images/products/product_1.png',
    title: 'Dropbox',
    totalDownloads: '594',
    isFolder: false,
    parent: '1'
  },
  {
    id: '21',
    createdAt: '31/03/2019',
    description: 'Medium is an online publishing platform developed by Evan Williams, and launched in August 2012.',
    media: '/static/images/products/product_2.png',
    title: 'Medium Corporation',
    totalDownloads: '625',
    isFolder: true,
    noOfChildren: 2,
    parent: '1'

  },
  {
    id: '22',
    createdAt: '03/04/2019',
    description: 'Slack is a cloud-based set of team collaboration tools and services, founded by Stewart Butterfield.',
    media: '/static/images/products/product_3.png',
    title: 'Slack',
    totalDownloads: '857',
    isFolder: false,
    parent: '21'
  },
  {
    id: '23',
    createdAt: '04/04/2019',
    description: 'Lyft is an on-demand transportation company based in San Francisco, California.',
    media: '/static/images/products/product_4.png',
    title: 'Lyft',
    totalDownloads: '406',
    isFolder: true,
    noOfChildren: 2,
    parent: '1'
  },
  {
    id: '24',
    createdAt: '04/04/2019',
    description: 'GitHub is a web-based hosting service for version control of code using Git.',
    media: '/static/images/products/product_5.png',
    title: 'GitHub',
    totalDownloads: '835',
    isFolder: false,
    parent: '22'
  },
  {
    id: '25',
    createdAt: '04/04/2019',
    description: 'Squarespace provides software as a service for website building and hosting. Headquartered in NYC.',
    media: '/static/images/products/product_6.png',
    title: 'Squarespace',
    totalDownloads: '835',
    isFolder: false,
    parent: '1'
  },
  {
    id: '26',
    createdAt: '31/03/2019',
    description: 'Medium is an online publishing platform developed by Evan Williams, and launched in August 2012.',
    media: '/static/images/products/product_2.png',
    title: 'Medium Corporation',
    totalDownloads: '625',
    isFolder: true,
    noOfChildren: 2,
    parent: '3'
  },
];
