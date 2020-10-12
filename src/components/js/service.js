import Web3 from "web3";
import { KittyService } from "./kitty.service";
import { KittyMarketPlaceService } from "./kittyMarketPlace.service";
import { WalletService } from "./walletService";

export class Service {
    static web3 = new Web3(Web3.givenProvider);
    static kitty = new KittyService(Service.web3);
    static market = new KittyMarketPlaceService(Service.web3, Service.kitty);
    static wallet = new WalletService(Service.web3);
}