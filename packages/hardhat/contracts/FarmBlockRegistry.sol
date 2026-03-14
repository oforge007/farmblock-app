// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IGnosisSafe {
    function getOwners() external view returns (address[] memory);
    function isOwner(address account) external view returns (bool);
}

contract FarmBlockRegistry {
    struct FarmBlock {
        address safeWallet;
        address nftDrop;
        uint256 createdAt;
        string name;
    }

    mapping(bytes32 => FarmBlock) public farmblocks;

    event FarmBlockRegistered(bytes32 indexed id, address indexed safeWallet, address nftDrop, string name);
    event FarmBlockNFTDropUpdated(bytes32 indexed id, address indexed nftDrop);
    event FarmBlockVerified(bytes32 indexed id, address indexed owner);
    event FarmBlockRejected(bytes32 indexed id, address indexed owner, string reason);

    function registerFarmBlock(bytes32 id, address safeWallet, address nftDrop, string calldata name) external {
        require(id != bytes32(0), "INVALID_ID");
        require(safeWallet != address(0), "INVALID_SAFE");
        require(farmblocks[id].safeWallet == address(0), "ALREADY_REGISTERED");

        farmblocks[id] = FarmBlock({
            safeWallet: safeWallet,
            nftDrop: nftDrop,
            createdAt: block.timestamp,
            name: name
        });

        emit FarmBlockRegistered(id, safeWallet, nftDrop, name);
    }

    function updateNFTDrop(bytes32 id, address nftDrop) external {
        FarmBlock storage fb = farmblocks[id];
        require(fb.safeWallet != address(0), "NOT_FOUND");
        require(IGnosisSafe(fb.safeWallet).isOwner(msg.sender), "NOT_OWNER");

        fb.nftDrop = nftDrop;
        emit FarmBlockNFTDropUpdated(id, nftDrop);
    }

    function verifyFarmBlock(bytes32 id) external {
        FarmBlock storage fb = farmblocks[id];
        require(fb.safeWallet != address(0), "NOT_FOUND");
        require(IGnosisSafe(fb.safeWallet).isOwner(msg.sender), "NOT_OWNER");

        emit FarmBlockVerified(id, msg.sender);
    }

    function rejectFarmBlock(bytes32 id, string calldata reason) external {
        FarmBlock storage fb = farmblocks[id];
        require(fb.safeWallet != address(0), "NOT_FOUND");
        require(IGnosisSafe(fb.safeWallet).isOwner(msg.sender), "NOT_OWNER");

        emit FarmBlockRejected(id, msg.sender, reason);
    }
}
