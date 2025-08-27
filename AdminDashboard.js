import React, { useState, useEffect } from 'react'; 
import SubmitToSWIFT from './SubmitToSWIFT';  // Import SubmitToSWIFT component
import './AdminDashboard.css';

function AdminDashboard() {
    const [transactions, setTransactions] = useState([]);
    const [payeeAccounts, setPayeeAccounts] = useState([]);  // State for Payee Accounts
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [showSwiftPage, setShowSwiftPage] = useState(false);  // To toggle SWIFT page
    const [showPayeePage, setShowPayeePage] = useState(false); // To toggle Payee accounts page

    // Fetch transactions and Payee accounts from the backend
    useEffect(() => {
        const fetchTransactionsAndPayees = async () => {
            try {
                setLoading(true);
                const [transactionsRes, payeeAccountsRes] = await Promise.all([
                    fetch('https://localhost:5000/api/admin/transactions', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                        },
                    }),
                    fetch('https://localhost:5000/api/payee-accounts', { // New endpoint for Payee accounts
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                        },
                    })
                ]);

                const transactionsData = await transactionsRes.json();
                const payeeAccountsData = await payeeAccountsRes.json();

                if (transactionsRes.ok && payeeAccountsRes.ok) {
                    setTransactions(transactionsData);
                    setPayeeAccounts(payeeAccountsData);
                } else {
                    setError('Failed to fetch data');
                }
            } catch (err) {
                setError('An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
        };

        fetchTransactionsAndPayees();
    }, []);

    // Handle the approve/reject actions for a transaction
    const handleVerify = async (transactionId, status) => {
        try {
            const response = await fetch(`https://localhost:5000/api/admin/transactions/${transactionId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                },
                body: JSON.stringify({ status }),
            });

            const result = await response.json();
            if (response.ok) {
                setMessage(`Transaction ${status} successfully.`);
                // Update the transaction status optimistically
                setTransactions(prevTransactions =>
                    prevTransactions.map(t =>
                        t._id === transactionId ? { ...t, status } : t
                    )
                );
            } else {
                setMessage(result.message || 'Error updating transaction.');
            }
        } catch (error) {
            setMessage('Error verifying transaction.');
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Admin Dashboard</h1>
            {error && <p className="error">{error}</p>}
            {message && <p className="message">{message}</p>}

            {loading ? (
                <p>Loading transactions...</p>
            ) : (
                <>
                    {!showSwiftPage && !showPayeePage ? (
                        <>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Transaction ID</th>
                                        <th>User ID</th>
                                        <th>Amount</th>
                                        <th>Currency</th>
                                        <th>Provider</th>
                                        <th>Payee Account</th>
                                        <th>SWIFT Code</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.length > 0 ? (
                                        transactions.map((transaction) => (
                                            <tr key={transaction._id}>
                                                <td>{transaction._id}</td>
                                                <td>{transaction.userId}</td>
                                                <td>{transaction.amount}</td>
                                                <td>{transaction.currency}</td>
                                                <td>{transaction.provider}</td>
                                                <td>{transaction.payeeAccount || 'N/A'}</td> {/* Display Payee Account */}
                                                <td>{transaction.swiftCode || 'N/A'}</td>  {/* Display SWIFT Code */}
                                                <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                                                <td>{transaction.status || 'Pending'}</td>
                                                <td>
                                                    {transaction.status === 'approved' || transaction.status === 'rejected' ? null : (
                                                        <>
                                                            <button onClick={() => handleVerify(transaction._id, 'approved')}>Approve</button>
                                                            <button onClick={() => handleVerify(transaction._id, 'rejected')}>Reject</button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="10">No transactions found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <button onClick={() => setShowSwiftPage(true)}>Open to SWIFT</button>
                            <button onClick={() => setShowPayeePage(true)}>Manage Payee Accounts</button>
                        </>
                    ) : showPayeePage ? (
                        <div className="payee-accounts-page">
                            <h2>Payee Accounts</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Account Number</th>
                                        <th>SWIFT Code</th>
                                        <th>Provider</th> {/* Display provider instead of status */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {payeeAccounts.length > 0 ? (
                                        payeeAccounts.map((account) => (
                                            <tr key={account._id}>
                                                <td>{account.payeeAccount}</td> {/* Display payeeAccount */}
                                                <td>{account.swiftCode}</td> {/* Display swiftCode */}
                                                <td>{account.provider}</td> {/* Display provider */}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3">No payee accounts found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <button onClick={() => setShowPayeePage(false)}>Back to Dashboard</button>
                        </div>
                    ) : (
                        <div className="swift-page">
                            <h2>Approved Transactions</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Transaction ID</th>
                                        <th>User ID</th>
                                        <th>Amount</th>
                                        <th>Currency</th>
                                        <th>Provider</th>
                                        <th>Payee Account</th>
                                        <th>SWIFT Code</th>
                                        <th>Date</th>
                                        <th>Submit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions
                                        .filter(transaction => transaction.status === 'approved')
                                        .map(transaction => (
                                            <tr key={transaction._id}>
                                                <td>{transaction._id}</td>
                                                <td>{transaction.userId}</td>
                                                <td>{transaction.amount}</td>
                                                <td>{transaction.currency}</td>
                                                <td>{transaction.provider}</td>
                                                <td>{transaction.payeeAccount}</td>
                                                <td>{transaction.swiftCode}</td>
                                                <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                                                <td>
                                                    <SubmitToSWIFT transaction={transaction} />
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            <button onClick={() => setShowSwiftPage(false)}>Back to Dashboard</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default AdminDashboard;
