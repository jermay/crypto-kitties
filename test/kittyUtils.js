/* eslint-env node, mocha */
exports.createKitty = (contract, kitty) => contract.createKitty(
  kitty.mumId,
  kitty.dadId,
  kitty.generation,
  kitty.genes,
  kitty.owner
);

exports.setOperator = (
  contract,
  kittyOwner,
  operator,
  isApproved = true
) => contract.setApprovalForAll(
  operator, isApproved, { from: kittyOwner, }
);

exports.getEventFromResult = (result, eventName) => {
  const event = result.logs.find((log) => log.event === eventName);
  return event.args;
};

exports.zeroAddress = '0x0000000000000000000000000000000000000000';
