import pool from '../config/db.js';

export const getWallets = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM wallets');
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createWallet = async (req, res) => {
    console.log('Request body:', req.body);
    try {
        const { user_name, balance } = req.body;
        if(!user_name) {
        return res.status(400).json({ error: 'User name is required' });
    }
    const result = await pool.query(
        'INSERT INTO wallets (user_name, balance) VALUES ($1, $2) RETURNING *',
        [user_name, balance || 0]
    );
    res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

export const updateWallet = async (req, res) => {
    try {
        const {id} = req.params;
        const {user_name, balance} = req.body;
        console.log('Params ID:',id);
        console.log('Request body:', req.body);
        if(!user_name && balance === undefined ) {
            return res.status(400).json({error: "user_name or balance is required"})
        }
        const wallet = await pool.query('SELECT * FROM wallets WHERE id = $1', [id]);
        if(wallet.rows.length === 0) {
            return res.status(404).json({error: "Wallet not found"});
        }
        const result = await pool.query(
            `UPDATE wallets SET 
                user_name = COALESCE($1, user_name),
                balance = COALESCE($2, balance),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $3 RETURNING *`,
            [user_name, balance, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteWallet = async(req, res) => {
    const {id} = req.params;
    console.log('Params ID:',id);
    try {
        const result = await pool.query(
            'DELETE FROM wallets WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        res.status(200).json({
            message: 'Wallet and related transactions deleted successfully',
            deleted: result.rows[0]
        });
    } catch (error) {
         console.error('Error in delete wallet:', error.message);
            res.status(500).json({
            error: 'Internal Server Error',
            details: error.message
        });
    }
}

export const depositWallet = async(req,res) => {
    const {id} = req.params;
    const {amount} = req.body;
    console.log('Params ID:',id);
    console.log('Amount:',amount);

    if(!amount || isNaN(amount) || amount <= 0 ) {
        return res.status(400).json({error: 'Amount must be a positive number'});
    }

    try {
        await pool.query('BEGIN');
        const wallet = await pool.query(
            'UPDATE wallets SET balance = + $1 WHERE id = $2 RETURNING *',[amount, id]
        );
        if(wallet.rowCount === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({error: 'Wallet not Found'});
        }
        await pool.query('COMMIT');
        res.status(200).json({message: 'Deposit successful', wallet:wallet.rows[0]});
        await pool.query(
            'INSERT INTO transactions (wallet_id, amount, type) VALUES ($1, $2, $3)',
            [id, amount, 'deposit']
        );
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error in deposit wallet:', error.message);
        res.status(500).json({error: 'Internal Server Error', details: error.message});
    }
    
};

export const withdrawWallet = async(req,res) => {
    const {id} = req.params;
    const {amount} = req.body;
    console.log('Params ID:',id);
    console.log('Amount:',amount);

    if(!amount || amount <= 0) {
        return res.status(400).json({error: 'Invalid withdrawal amount'});
    }

    try {
        const walletResult = await pool.query('SELECT * FROM wallets WHERE id = $1', [id]);
        if(walletResult.rowCount === 0) {
            return res.status(404).json({error: 'wallet not found'});
        }
        const wallet = walletResult.rows[0];
        if(wallet.balance < amount) {
            return res.status(404).json({error: 'Insufficient balance'});
        }
        const newBalance = wallet.balance - amount;
        const updateWallet = await pool.query(
            'UPDATE wallets SET balance = $1 WHERE id = $2 RETURNING *',[newBalance, id]
        );
        res.status(200).json({message: 'Withdrawal successful', wallet: updateWallet.rows[0]});
        await pool.query(
            'INSERT INTO transactions (wallet_id, amount, type) VALUES ($1, $2, $3)',[id, amount, 'withdrawal']
        )
    } catch (error) {
        console.error('Error in withdraw wallet:', error.message);
        res.status(500).json({error: 'Internal Server Error', details: error.message});
    }
};

export const getTransactions = async (req, res) => {
    // const {walletId} = parseInt(req.params.id, 10);
    // const {amount} = req.body;
    const {id} = req.params;
    console.log('Params ID:', id);
    // console.log('Amount:', amount);
    try {
        const result = await pool.query(
            'SELECT * FROM transactions WHERE wallet_id = $1 ORDER BY created_at DESC',[id]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error in getTransaction :', error);
        res.status(500).json({error: 'Internal server error', details: error.message});
    }
};

