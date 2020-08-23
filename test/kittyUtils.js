exports.createKitty = (contract, kitty) => {
    return contract.createKitty(
        kitty.mumId,
        kitty.dadId,
        kitty.generation,
        kitty.genes,
        kitty.owner
    );
}

exports.setOperator = (contract, kittyOwner, operator, isApproved = true) => {
    // grant operator approval
    return contract.setApprovalForAll(
        operator, isApproved, { from: kittyOwner });
}

exports.getEventFromResult = (result, eventName) => {
    let event = result.logs.find(log => log.event === eventName);
    return event.args;
}
