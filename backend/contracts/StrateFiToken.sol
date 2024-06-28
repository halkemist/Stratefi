// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/**
 * @title Token contract for StrateFi.
 * @dev Extends various OpenZeppelin token modules for the SFT (StrateFiToken) token.
 */
contract StrateFiToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable, ERC20Permit, ERC20Votes {
    /**
     * @notice Initialize the contract and mint 1000000000 tokens.
     * @param initialOwner The address of the owner of the contract.
     */
    constructor(address initialOwner)
        ERC20("StrateFiToken", "SFT")
        Ownable(initialOwner)
        ERC20Permit("StrateFiToken")
    {
        _mint(msg.sender, 1000000000 * 10 ** decimals());
    }

    /**
     * @notice Pause all token transfers.
     * @dev Only callable by the owner of the contract.
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause all token transfers.
     * @dev Only callable by the owner of the contract.
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @notice Mint new tokens and send them to a recipient.
     * @dev Only callable by the owner of the contract.
     * @param to The address which mint the tokens.
     * @param amount Amount of tokens to mint.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // The following functions are overrides required by Solidity.

    /**
     * @notice Override function to custom clock mode type to timestamp instead of block.
     * @return The clock mode of this token contract.
     */
    function CLOCK_MODE() public pure override returns (string memory) {
        return "mode=timestamp";
    }

    /**
     * @dev Internal function to update token balances and perform voting snapshot.
     * @param from The address from which tokens are transferred.
     * @param to The address to which tokens are transferred.
     * @param value The amount of tokens transferred.
     */
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable, ERC20Votes)
    {
        super._update(from, to, value);
    }

    /**
     * @dev Returns the nonce for the given owner, required by ERC20Permit.
     * @param owner The address for which to return the nonce.
     * @return The nonce of the owner.
     */
    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
