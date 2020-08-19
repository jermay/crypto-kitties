pragma solidity >=0.5.0 <0.6.0;

import "./Ownable.sol";
import "./SafeMath.sol";
import "./KittyContract.sol";

contract KittyFactory is Ownable, KittyContract {
    using SafeMath32 for uint32;

    uint256 public constant CREATION_LIMIT_GEN0 = 10;
    uint256 internal _gen0Counter;

    event Birth(
        address owner,
        uint256 kittyId,
        uint256 mumId,
        uint256 dadId,
        uint256 genes
    );

    function kittiesOf(address _owner) public view returns (uint256[] memory) {
        // get the number of kittes owned by _owner
        uint256 ownerCount = ownerKittyCount[_owner];
        if (ownerCount == 0) {
            return new uint256[](0);
        }

        // iterate through each kittyId until we find all the kitties
        // owned by _owner
        uint256[] memory ids = new uint256[](ownerCount);
        uint256 i = 1;
        uint256 count = 0;
        while (count < ownerCount || i < kitties.length) {
            if (kittyToOwner[i] == _owner) {
                ids[count] = i;
                count = count.add(1);
            }
            i = i.add(1);
        }

        return ids;
    }

    function getGen0Count() public view returns (uint256) {
        return _gen0Counter;
    }

    function createKittyGen0(uint256 _genes)
        public
        onlyOwner
        returns (uint256)
    {
        require(_gen0Counter < CREATION_LIMIT_GEN0, "gen0 limit exceeded");

        _gen0Counter = _gen0Counter.add(1);
        return _createKitty(0, 0, 0, _genes, msg.sender);
    }

    function _createKitty(
        uint256 _mumId,
        uint256 _dadId,
        uint256 _generation,
        uint256 _genes,
        address _owner
    ) internal returns (uint256) {
        Kitty memory kitty = Kitty({
            genes: _genes,
            birthTime: uint64(now),
            mumId: uint32(_mumId),
            dadId: uint32(_dadId),
            generation: uint16(_generation)
        });

        uint256 newKittenId = kitties.push(kitty) - 1;
        emit Birth(_owner, newKittenId, _mumId, _dadId, _genes);

        _transfer(address(0), _owner, newKittenId);

        return newKittenId;
    }

    function breed(uint256 _dadId, uint256 _mumId)
        public
        onlyKittyOwner(_dadId)
        onlyKittyOwner(_mumId)
        returns (uint256)
    {
        Kitty storage dad = kitties[_dadId];
        Kitty storage mum = kitties[_mumId];
        uint256 newDna = _mixDna(dad.genes, mum.genes, now);

        // generation is 1 higher than max of parents
        uint256 newGeneration = mum.generation.add(1);
        if (dad.generation > mum.generation) {
            newGeneration = dad.generation.add(1);
        }

        return _createKitty(_mumId, _dadId, newGeneration, newDna, msg.sender);
    }

    event Test(uint256 index, uint256 i, string who, uint8 gene, uint256 dna);

    function _mixDna(
        uint256 _dadDna,
        uint256 _mumDna,
        uint256 _seed
    )
        internal
        pure
        returns (uint256)
    {
        uint256[8] memory geneArray;
        uint8 random = uint8(_seed % 255); // 8 bit number
        uint256 i = 1;
        uint256 index = 7; // loop in reverse

        for (index = 8; index > 0; index--) {
            /*
            Use bitwise AND with a mask to extract each pair
            00000001 = 1
            00000010 = 2
            00000100 = 4
            etc
            */
            if (random & i == 0) {
                // extract last 2 digits
                geneArray[index-1] = uint8(_mumDna % 100);
            } else {
                geneArray[index-1] = uint8(_dadDna % 100);
            }

            if (i < 128) {
                // cut off the last DNA pair so it's ready to extract
                // in the next loop
                _mumDna = _mumDna / 100;
                _dadDna = _dadDna / 100;

                // shift the mask to the left
                i = i * 2;
            }
        }

        // recombine DNA
        uint256 newGenes = 0;
        for (i = 0; i < 8; i++) {
            newGenes = newGenes + geneArray[i];
            if (i != 7) {
                newGenes = newGenes * 100;
            }
        }

        return newGenes;
    }
}
