const SimpleStorage = artifacts.require("./SimpleStorage.sol");
const assert = require("chai").assert;
const truffleAssert = require('truffle-assertions');


contract("SimpleStorage", accounts => {
  it("...should store the value 89.", async () => {
    const simpleStorageInstance = await SimpleStorage.deployed();

    // Set value of 89
    await simpleStorageInstance.set(89, { from: accounts[0] });

    // Get stored value
    const storedData = await simpleStorageInstance.get.call();

    assert.equal(storedData, 89, "The value 89 was not stored.");
  });

  it("...should trigger an event when stored value changes", async () => {
    const simpleStorage = await SimpleStorage.deployed();

    // Set value of 89
    const txResult = await simpleStorage.set(89, { from: accounts[0] })

    // Check if the event is triggered with the good value
    truffleAssert.eventEmitted(txResult, 'StoredDataChange', event => {
      return event.newValue.toString() == 89
    })
  });
});
