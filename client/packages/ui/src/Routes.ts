export const Routes = {
  RaffleList: '/',
  RaffleDetail: '/raffle/:id',
  RaffleCreate: '/create',
  FAQ: '/faq'
}

export const createRoute = ({ route, id }) => route.replace(':id', id)
