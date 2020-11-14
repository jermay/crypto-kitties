import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

export const EthNetworks = {
  '0x1': { id: '0x1', num: 1, name: 'Ethereum MainNet', },
  '0x3': { id: '0x3', num: 3, name: 'Ropsten Test', },
  '0x4': { id: '0x4', num: 4, name: 'Rinkeby Test', },
  '0x5': { id: '0x5', num: 5, name: 'Goerli Test', },
  '0x2a': { id: '0x2a', num: 42, name: 'Kovan Test', },
  '0x539': { id: '0x539', num: 1337, name: 'Ganache Local', },
};

const initialState = {
  ids: Object.keys(EthNetworks),
  entities: EthNetworks,
};

const networkAdapter = createEntityAdapter();

const networkSlice = createSlice({
  name: 'networks',
  initialState,
  reducers: {},
});

export const {
  selectAll: selectAllNetworks,
  selectById: selectNetworkById,
  selectIds: selectAllNetworkIds,
} = networkAdapter.getSelectors((state) => state.networks);

export default networkSlice.reducer;
