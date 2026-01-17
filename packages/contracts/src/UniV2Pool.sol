// SPDX-License-Identifier: MIT

pragma solidity ^0.8.31;

import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";

/**
 * @title UniV2Pool simple clone
 * @notice This is created just for testing and demo purposes.
 * @notice Simple DEX contract that allows users to swap TokenA for TokenB and TokenB for TokenA
 * @dev This is heavily inspired from speedrunethereum dex challenge https://github.com/scaffold-eth/se-2-challenges/tree/challenge-dex
 */
contract UniV2Pool {
    /* ========== GLOBAL VARIABLES ========== */

    IERC20 tokenA; //instantiates the imported contract
    IERC20 tokenB; //instantiates the imported contract
    uint256 public totalLiquidity;
    mapping(address => uint256) public liquidity;

    /* ========== EVENTS ========== */

    event Swap(address swapper, address inputToken, uint256 inputAmount, address outputToken, uint256 outputAmount);
    event PriceUpdated(uint256 price);
    /**
     * @notice Emitted when liquidity provided to DEX and mints LPTs.
     */
    event LiquidityProvided(
        address liquidityProvider, uint256 liquidityMinted, uint256 tokenAInput, uint256 tokenBInput
    );

    /**
     * @notice Emitted when liquidity removed from DEX and decreases LPT count within DEX.
     */
    event LiquidityRemoved(
        address liquidityRemover, uint256 liquidityWithdrawn, uint256 tokenAOutput, uint256 tokenBOutput
    );

    /* ========== CONSTRUCTOR ========== */

    constructor(address tokenAAddr, address tokenBAddr) {
        tokenA = IERC20(tokenAAddr); //specifies the token address that will hook into the interface and be used through the variable 'tokenA'
        tokenB = IERC20(tokenBAddr); //specifies the token address that will hook into the interface and be used through the variable 'tokenB'
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    /**
     * @notice initializes amount of tokens that will be transferred to the DEX itself from the erc20 contract. Loads contract up with both TokenA and TokenB.
     * @param tokenAAmount amount of TokenA to be transferred to DEX
     * @param tokenBAmount amount of TokenB to be transferred to DEX
     * @return totalLiquidity is the number of LPTs minting as a result of deposits made to DEX contract
     * NOTE: since ratio is 1:1, this is fine to initialize the totalLiquidity as equal to tokenA balance of contract.
     */
    function init(uint256 tokenAAmount, uint256 tokenBAmount) public returns (uint256) {
        require(totalLiquidity == 0, "DEX: init - already has liquidity");
        totalLiquidity = tokenA.balanceOf(address(this)); // or use tokenB, since 1:1
        liquidity[msg.sender] = totalLiquidity;
        require(tokenA.transferFrom(msg.sender, address(this), tokenAAmount), "DEX: init - transfer did not transact");
        require(tokenB.transferFrom(msg.sender, address(this), tokenBAmount), "DEX: init - transfer did not transact");
        return totalLiquidity;
    }

    /**
     * @notice returns the amount you should receive (yOutput) when given the reserves of both assets in the pool
     */
    function price(uint256 xInput, uint256 xReserves, uint256 yReserves) public pure returns (uint256 yOutput) {
        uint256 numerator = xInput * yReserves;
        uint256 denominator = (xReserves) + xInput;
        return (numerator / denominator);
    }

    /**
     * @notice returns the current price of TokenA in TokenB
     */
    function currentPrice() public view returns (uint256 _currentPrice) {
        _currentPrice = price(1 ether, tokenA.balanceOf(address(this)), tokenB.balanceOf(address(this)));
    }

    /**
     * @notice returns the amount you need to put in (xInput) when given the amount of yOutput you want along with the reserves of both assets in the pool
     */
    function calculateXInput(uint256 yOutput, uint256 xReserves, uint256 yReserves)
        public
        pure
        returns (uint256 xInput)
    {
        uint256 numerator = yOutput * xReserves;
        uint256 denominator = yReserves - yOutput;

        return (numerator / denominator) + 1;
    }

    /**
     * @notice sends TokenA to DEX in exchange for TokenB
     */
    function tokenAToTokenB(uint256 tokenAInput) internal returns (uint256 tokenBOutput) {
        require(tokenAInput > 0, "cannot swap 0 TokenA");
        uint256 tokenAReserve = tokenA.balanceOf(address(this));
        uint256 tokenBReserve = tokenB.balanceOf(address(this));
        tokenBOutput = price(tokenAInput, tokenAReserve, tokenBReserve);

        require(tokenB.transfer(msg.sender, tokenBOutput), "tokenAToTokenB(): reverted swap.");
        emit Swap(msg.sender, address(tokenA), tokenAInput, address(tokenB), tokenBOutput);
        return tokenBOutput;
    }

    /**
     * @notice sends TokenB to DEX in exchange for TokenA
     */
    function tokenBToTokenA(uint256 tokenBInput) internal returns (uint256 tokenAOutput) {
        require(tokenBInput > 0, "cannot swap 0 TokenB");
        uint256 tokenAReserve = tokenA.balanceOf(address(this));
        uint256 tokenBReserve = tokenB.balanceOf(address(this));
        tokenAOutput = price(tokenBInput, tokenBReserve, tokenAReserve);

        require(tokenA.transfer(msg.sender, tokenAOutput), "tokenBToTokenA(): reverted swap.");
        emit Swap(msg.sender, address(tokenB), tokenBInput, address(tokenA), tokenAOutput);
        return tokenAOutput;
    }

    /**
     * @notice allows users to swap TokenA for TokenB or TokenB for TokenA with a single method
     */
    function swap(address inputToken, uint256 inputAmount) public returns (uint256 outputAmount) {
        require(inputAmount > 0, "cannot swap 0 tokens");
        require(inputToken == address(tokenA) || inputToken == address(tokenB), "invalid input token");

        if (inputToken == address(tokenA)) {
            require(tokenA.balanceOf(msg.sender) >= inputAmount, "insufficient TokenA balance");
            require(tokenA.allowance(msg.sender, address(this)) >= inputAmount, "insufficient TokenA allowance");
            require(tokenA.transferFrom(msg.sender, address(this), inputAmount), "swap: TokenA transfer failed");
            outputAmount = tokenAToTokenB(inputAmount);
        } else {
            require(tokenB.balanceOf(msg.sender) >= inputAmount, "insufficient TokenB balance");
            require(tokenB.allowance(msg.sender, address(this)) >= inputAmount, "insufficient TokenB allowance");
            require(tokenB.transferFrom(msg.sender, address(this), inputAmount), "swap: TokenB transfer failed");
            outputAmount = tokenBToTokenA(inputAmount);
        }

        emit PriceUpdated(currentPrice());
    }

    /**
     * @notice allows deposits of TokenA and TokenB to liquidity pool
     * NOTE: user has to make sure to give DEX approval to spend their tokens on their behalf by calling approve function prior to this function call.
     * NOTE: Equal parts of both assets will be removed from the user's wallet with respect to the price outlined by the AMM.
     */
    function deposit(uint256 tokenAAmount, uint256 tokenBAmount) public returns (uint256 liquidityMinted) {
        require(tokenAAmount > 0 && tokenBAmount > 0, "Must send both tokens when depositing");
        uint256 tokenAReserve = tokenA.balanceOf(address(this));
        uint256 tokenBReserve = tokenB.balanceOf(address(this));
        uint256 liquidityFromA = (tokenAAmount * totalLiquidity) / tokenAReserve;
        uint256 liquidityFromB = (tokenBAmount * totalLiquidity) / tokenBReserve;
        liquidityMinted = liquidityFromA < liquidityFromB ? liquidityFromA : liquidityFromB; // take the min to maintain ratio

        liquidity[msg.sender] += liquidityMinted;
        totalLiquidity += liquidityMinted;

        require(tokenA.transferFrom(msg.sender, address(this), tokenAAmount));
        require(tokenB.transferFrom(msg.sender, address(this), tokenBAmount));
        emit LiquidityProvided(msg.sender, liquidityMinted, tokenAAmount, tokenBAmount);
        return liquidityMinted;
    }

    /**
     * @notice allows withdrawal of TokenA and TokenB from liquidity pool
     * NOTE: with this current code, the msg caller could end up getting very little back if the liquidity is super low in the pool. I guess they could see that with the UI.
     */
    function withdraw(uint256 amount) public returns (uint256 tokenAAmount, uint256 tokenBAmount) {
        require(liquidity[msg.sender] >= amount, "withdraw: sender does not have enough liquidity to withdraw.");
        uint256 tokenAReserve = tokenA.balanceOf(address(this));
        uint256 tokenBReserve = tokenB.balanceOf(address(this));
        tokenAAmount = (amount * tokenAReserve) / totalLiquidity;
        tokenBAmount = (amount * tokenBReserve) / totalLiquidity;
        liquidity[msg.sender] -= amount;
        totalLiquidity -= amount;
        require(tokenA.transfer(msg.sender, tokenAAmount));
        require(tokenB.transfer(msg.sender, tokenBAmount));
        emit LiquidityRemoved(msg.sender, amount, tokenAAmount, tokenBAmount);
        return (tokenAAmount, tokenBAmount);
    }
}
