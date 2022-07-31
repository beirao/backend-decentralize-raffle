const { deployments, ethers, getNamedAccounts, network, provider, chainId } = require("hardhat")

async function mockKeepers() {
    deployer = (await getNamedAccounts()).deployer
    // raffle = await ethers.getContractAt("Raffle", "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9", deployer)
    raffle = await ethers.getContract("Raffle")

    console.log(raffle.address)

    const checkData = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(""))

    const isOpen = await raffle.getRaffleState()
    console.log("getRaffleState : ", isOpen)

    const numOfPlayer = await raffle.getNumberOfPlayers()
    console.log("getPlayers : ", parseInt(numOfPlayer._hex))

    const interval = await raffle.getInterval()
    console.log("interval : ", parseInt(interval._hex))

    // const balance = await raffle.getBalance(raffle.address)
    // console.log("balance : ", parseInt(balance._hex))

    const { upkeepNeeded } = await raffle.callStatic.checkUpkeep(checkData)
    console.log(upkeepNeeded)
    if (upkeepNeeded) {
        const tx = await raffle.performUpkeep(checkData)
        const txReceipt = await tx.wait(1)
        const requestId = txReceipt.events[1].args.requestId
        console.log(`Performed upkeep with RequestId: ${requestId}`)
        await mockVrf(requestId, raffle)
    } else {
        console.log("No upkeep needed")
    }
}

async function mockVrf(requestId, raffle) {
    console.log("We on a local network? Ok let's pretend...")
    const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
    await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, raffle.address)
    console.log("Responded!")
    const recentWinner = await raffle.getRecentWinner()
    console.log(`The winner is: ${recentWinner}`)
}

mockKeepers()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
