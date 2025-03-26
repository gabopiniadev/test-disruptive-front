import React, { useState } from "react";
import axios from "axios";

const PaymentStatus: React.FC = () => {
    const [address, setAddress] = useState<string>("");
    const [status, setStatus] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCheckStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setStatus(null);

        try {
            const response = await axios.get(`http://localhost:3000/api/payments/status/${address}`);
            setStatus(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || "Ocurrió un error al consultar el estado del pago.");
        }
    };

    return (
        <div>
            <h2>Estado del Pago</h2>
            <form onSubmit={handleCheckStatus}>
                <label>
                    Dirección (Address):
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Ingresa la dirección"
                        required
                    />
                </label>
                <button type="submit" disabled={!address}>Consultar</button>
            </form>

            {status && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Estado del Pago</h3>
                    <p><strong>Estado:</strong> {status.state}</p>
                    <p><strong>Total Recibido:</strong> {status.totalReceived}</p>
                </div>
            )}

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default PaymentStatus;
