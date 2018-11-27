const badge = require('badgeit')

async function getBadge (status, type) {
  let color = ''

  switch (status) {
    case 'outofdate':
    case 'insecure':
      color = 'rgb(224, 93, 68)'
      break
    case 'unknown':
      color = 'rgb(159, 159, 159)'
      break
    case 'notsouptodate':
      color = 'rgb(223, 179, 23)'
      break
    default:
      color = 'rgb(68, 204, 17)'
  }

  return badge({ text: [type, status], colors: { right: color } })
}

module.exports = {
  getBadge
}
