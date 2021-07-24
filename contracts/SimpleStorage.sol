// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

contract SimpleStorage {
    uint256 storedData;

    event StoredDataChange(uint256 newValue);

    function set(uint256 _x) public {
        storedData = _x;

        emit StoredDataChange(storedData);
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}
