var ERC721MintableComplete = artifacts.require('ERC721MintableComplete');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    const account_four = accounts[3];
    const account_five = accounts[4];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens
            await this.contract.mint(account_two, 1, {from: account_one});
            await this.contract.mint(account_three, 2, {from: account_one});
            await this.contract.mint(account_four, 3, {from: account_one});
        })

        it('should return total supply', async function () { 
            let totalSupply = await this.contract.totalSupply.call();
            assert.equal(totalSupply.toNumber(), 3, "totalSupply is not correct");
        })

        it('should get token balance', async function () { 
            let tokenBalance = await this.contract.balanceOf.call(account_two, {from: account_one});
            assert.equal(tokenBalance.toNumber(), 1, "account_two token balance should be 1");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let tokenURI = await this.contract.tokenURI.call(1, {from:account_one});
            assert(tokenURI == "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", "tokenURI does not match given uri");
        })

        it('should transfer token from one owner to another', async function () { 
            let tokenId = 2;
            await this.contract.approve.call(account_four, tokenId, {from: account_three});
            await this.contract.transferFrom.call(account_three, account_four, tokenId, {from: account_three});

            // Verify token transfer
            newOwner = await this.contract.ownerOf.call(tokenId);
            assert.equal(newOwner, account_three, "The new ownere of the tokenId 2 should be account_three");

        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let mintFailed = false;
            try {
                await this.contract.mint(account_five, 4, {from: account_two});
            } 
            catch(e) {
                mintFailed = true;
            }

            assert.equal(mintFailed, true, "Error processing mint");
        })

        it('should return contract owner', async function () { 
            let contractOwner = await this.contract.getOwner.call();
            assert.equal(contractOwner, account_one, "Error rettieving contract owner");
        })

    });
})