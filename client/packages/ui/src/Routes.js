export const Routes = {
  RaffleList: '/',
  RaffleDetail: '/raffle/:id'
}

export const createRoute = ({ route, id }) => route.replace(':id', id)
