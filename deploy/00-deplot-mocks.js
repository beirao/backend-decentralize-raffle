const { devChain, DECIMALS, INITIAL_ANSWER } = require("../helper-hardhat-config")
const { getNamedAccounts, deployments, network, ethers } = require("hardhat")

const BASE_FEE = ethers.utils.parseEther("0.25") // LINK
const GAS_PRICE_LINK = 1e9 // link per gas

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const args = [BASE_FEE, GAS_PRICE_LINK]

    if (devChain.includes(network.name)) {
        log("Mock deploying...")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: args,
        })
        log("Mocks deploy ! ")
        log("--------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
