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

    function _mixDna(
        uint256 _dadDna,
        uint256 _mumDna,
        uint256 _seed
    )
        internal
        pure
        returns (uint256)
    {
        uint16 size = 10;
        uint256[10] memory geneSizes = [uint256(2),2,2,2,1,1,2,2,1,1];
        uint256 mod = 2 ** size - 1;
        uint256[10] memory geneArray;
        uint16 random = uint16(_seed % mod); // 8 bit number
        uint256 i = 1;
        uint256 index = 7; // loop in reverse

        // emit Test2(random);

        for (index = size; index > 0; index--) {
            /*
            Use bitwise AND with a mask to choose gene
            if 0 then Mum, if 1 then Dad
            00000001 = 1
            00000010 = 2
            00000100 = 4
            etc
            */
            uint256 dnaMod = 10 ** geneSizes[index-1];
            if (random & i == 0) {
                // extract last 2 digits
                geneArray[index-1] = uint16(_mumDna % dnaMod);
            } else {
                geneArray[index-1] = uint16(_dadDna % dnaMod);
            }

            if (i <= mod) {
                // cut off the last gene to expose the next gene at the end
                _mumDna = _mumDna / dnaMod;
                _dadDna = _dadDna / dnaMod;

                // shift the mask to the left
                i = i * 2;
            }
        }

        // recombine DNA
        uint256 newGenes = 0;
        for (i = 0; i < size; i++) {
            // add gene
            newGenes = newGenes + geneArray[i];
            
            // shift dna LEFT to make room for next gene
            if (i != size - 1) {
                uint256 dnaMod = 10 ** geneSizes[i+1];
                newGenes = newGenes * dnaMod;
            }
        }

        return newGenes;
    }
}
