import ApiSwgohHelp from 'api-swgoh-help'

export const swapi = new ApiSwgohHelp({
    'username': process.env.SWGOH_USERNAME,
    'password':process.env.SWGOH_PASSWORD
})