const deployer = require('../helpers/utils/deployer')(web3, artifacts)
const { RULINGS } = require('../helpers/utils/enums')

contract('Agreement', ([_, user]) => {
  let disputable, actionId

  beforeEach('deploy disputable instance', async () => {
    disputable = await deployer.deployAndInitializeDisputableWrapper()
  })

  describe.only('gas costs', () => {
    const itCostsAtMost = (expectedCost, call) => {
      it(`should cost up to ${expectedCost.toLocaleString()} gas [ @skip-on-coverage ]`, async () => {
        const { receipt: { gasUsed } } = await call()
        console.log(`gas costs: ${gasUsed.toLocaleString()}`)
        assert.isAtMost(gasUsed, expectedCost)
      })
    }

    context('stake', () => {
      itCostsAtMost(204e3, () => disputable.stake({ user }))
    })

    context('unstake', () => {
      beforeEach('stake', async () => {
        await disputable.stake({ user })
      })

      itCostsAtMost(204e3, () => disputable.unstake({ user }))
    })

    context('newAction', () => {
      itCostsAtMost(340e3, async () => (await disputable.newAction({})).receipt)
    })

    context('closeAction', () => {
      beforeEach('submit action', async () => {
        ({ actionId } = await disputable.newAction({}))
      })

      itCostsAtMost(102e3, () => disputable.close(actionId))
    })

    context('challenge', () => {
      beforeEach('submit action', async () => {
        ({ actionId } = await disputable.newAction({}))
      })

      itCostsAtMost(475e3, async () => (await disputable.challenge({ actionId })).receipt)
    })

    context('settle', () => {
      beforeEach('submit and challenge action', async () => {
        ({ actionId } = await disputable.newAction({}))
        await disputable.challenge({ actionId })
      })

      itCostsAtMost(297e3, () => disputable.settle({ actionId }))
    })

    context('dispute', () => {
      beforeEach('submit and challenge action', async () => {
        ({ actionId } = await disputable.newAction({}))
        await disputable.challenge({ actionId })
      })

      itCostsAtMost(369e3, () => disputable.dispute({ actionId }))
    })

    context('executeRuling', () => {
      beforeEach('submit and dispute action', async () => {
        ({ actionId } = await disputable.newAction({}))
        await disputable.challenge({ actionId })
        await disputable.dispute({ actionId })
      })

      context('refused', () => {
        itCostsAtMost(301e3, () => disputable.executeRuling({ actionId, ruling: RULINGS.REFUSED }))
      })

      context('in favor of the submitter', () => {
        itCostsAtMost(289e3, () => disputable.executeRuling({ actionId, ruling: RULINGS.IN_FAVOR_OF_SUBMITTER }))
      })

      context('in favor of the challenger', () => {
        itCostsAtMost(424e3, () => disputable.executeRuling({ actionId, ruling: RULINGS.IN_FAVOR_OF_CHALLENGER }))
      })
    })
  })
})
