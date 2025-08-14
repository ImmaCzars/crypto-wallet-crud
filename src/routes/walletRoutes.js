import express from 'express';
import { getWallets, createWallet, updateWallet, deleteWallet, depositWallet, withdrawWallet, getTransactions } from '../controllers/walletController.js';

const router = express.Router();

router.get('/wallets', getWallets);
router.post('/wallets', createWallet);
router.put('/wallets/:id', updateWallet);
router.delete('/wallets/:id', deleteWallet);
router.post('/wallets/:id/deposit', depositWallet);
router.post('/wallets/:id/withdraw', withdrawWallet);
router.get('/wallets/:id/transactions', getTransactions);


export default router;
