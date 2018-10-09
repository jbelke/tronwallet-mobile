export const orderBalances = (balances, fixedTokens) => {
  let orderedBalances = []
  let rest = []

  balances.forEach(balance => {
    const verifiedIndex = fixedTokens.findIndex(token => token === balance.name)
    if (verifiedIndex > -1) {
      balance.verified = true
      orderedBalances[verifiedIndex] = balance
      return
    }
    rest.push(balance)
  })

  return [
    ...orderedBalances.filter(balance => balance),
    ...rest
  ]
}
