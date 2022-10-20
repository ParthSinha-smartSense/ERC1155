const erc1155 = artifacts.require("tokens");
const truffleAssert = require("truffle-assertions");
require("web3");
const chainID = config.network_id;
(chainID != 5777 ? contract : contract.skip)(
  "CrowdSale Testnet",
  async function (accounts) {
    before(async () => {
      instance = await erc1155.deployed();
    });

    it("Deployed succesfully", async () => {
      instance.address != "";
    });

    it("Mint token", async () => {
      //await instance.mint.sendTransaction(1, 1, { from: accounts[0] });
      await new Promise((resolve, reject) => {
        instance.mint
          .sendTransaction(1, 1, { from: accounts[0] })
          .on("confirmation", function (confNumber, receipt, latestBlockHash) {
            if (confNumber > 3) resolve();
            else console.log(confNumber);
          });
      });

      // await b;

      await instance
        .balanceOf(accounts[0], 1)
        .then((x) => assert(x.toString() == 1));
    });

    it("Can't mint more than supply", async () => {
      truffleAssert.fails(instance.mint(1, 1, { from: accounts[0] }));
    });

    it("Batch mint", async () => {
      //   await instance.mintBatch.sendTransaction([2, 3, 7, 9], [1, 1, 50, 60]);
      await new Promise((resolve, reject) => {
        instance.mintBatch
          .sendTransaction([2, 3, 7, 9], [1, 1, 50, 60])
          .on("confirmation", function (confNumber, receipt, latestBlockHash) {
            if (confNumber > 3) resolve();
            else console.log(confNumber);
          });
      });

      await instance.balanceOfBatch
        .call(
          [accounts[0], accounts[0], accounts[0], accounts[0]],
          [2, 3, 7, 9]
        )
        .then((x) =>
          assert(
            x[0] == 1 && x[1] == 1 && x[2] == 50 && x[3] == 60,
            "All minted successfully"
          )
        );
    });

    it("Burn tokens", async () => {
      //await instance.burn.sendTransaction(accounts[0], 1, 1);
      await new Promise((resolve, reject) => {
        instance.burn
          .sendTransaction(accounts[0], 1, 1)
          .on("confirmation", function (confNumber, receipt, latestBlockHash) {
            if (confNumber > 3) resolve();
            else console.log(confNumber);
          });
      });
      await instance
        .balanceOf(accounts[0], 1)
        .then((x) => assert(x.toString() == 0));
    });

    it("Batch burn", async () => {
      // await instance.burnBatch.sendTransaction(
      //   accounts[0],
      //   [2, 3, 7, 9],
      //   [1, 1, 50, 60]
      // );

      await new Promise((resolve, reject) => {
        instance.burnBatch
          .sendTransaction(accounts[0], [2, 3, 7, 9], [1, 1, 50, 60])
          .on("confirmation", function (confNumber, receipt, latestBlockHash) {
            if (confNumber > 3) resolve();
            else console.log(confNumber);
          });
      });
      await instance
        .balanceOfBatch(
          [accounts[0], accounts[0], accounts[0], accounts[0]],
          [2, 3, 7, 9]
        )
        .then((x) => assert(x[0] == 0 && x[1] == 0 && x[2] == 0 && x[3] == 0));
    });

    it("Create token", async () => {
      //   await instance.createToken
      //     .sendTransaction(100, { from: accounts[0] })
      //     .then(async (results) => {
      //       await truffleAssert.eventEmitted(results, "newToken", async (ev) =>
      //         assert(
      //           ev.ID == "11" &&
      //             ev.amount == "100" &&
      //             (await instance.totalTypes.call()) == 11
      //         )
      //       );
      //     });
      await new Promise((resolve, reject) => {
         instance.createToken
          .sendTransaction(100, { from: accounts[0] })
          .on("confirmation", function (confNumber, receipt, latestBlockHash) {
            if (confNumber > 3) resolve();
            else console.log(confNumber);
          })
          .then(async (results) => {
            await truffleAssert.eventEmitted(results, "newToken", async (ev) =>
              assert(
                ev.ID == "11" &&
                  ev.amount == "100" &&
                  (await instance.totalTypes.call()) == 11
              )
            );
          });
      });
    });

    it("Batch create token", async () => {
      let currentId = await instance.totalTypes.call();
        await instance.createTokenBatch
          .sendTransaction([1, 3, 55, 43])
          .then(async (results) => {
            await truffleAssert.eventEmitted(results, "newToken", async (ev) => {
              currentId++;
              assert(currentId == ev.ID);
            });
          });

      await new Promise((resolve, reject) => {
        instance.createTokenBatch
          .sendTransaction([1, 3, 55, 43])
          .on("confirmation", function (confNumber, receipt, latestBlockHash) {
            if (confNumber > 3) resolve();
            else console.log(confNumber);
          })
          .then(async (results) => {
            await truffleAssert.eventEmitted(
              results,
              "newToken",
              async (ev) => {
                currentId++;
                assert(currentId == ev.ID);
              }
            );
          });
      });
    });
  }
);