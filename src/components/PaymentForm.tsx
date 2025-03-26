import React, { useState } from "react";
import axios from "axios";

const PaymentForm: React.FC = () => {
    const [fundsGoal, setFundsGoal] = useState<number | "">("");
    const [paymentData, setPaymentData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setPaymentData(null);

        try {
            const response = await axios.post("http://localhost:3000/api/payments/create", { fundsGoal });
            setPaymentData(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || "Ocurrió un error al intentar crear el pago.");
        }
    };

    return (
        <div>
            <h2>Crear Pago</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Monto (Funds Goal):
                    <input
                        type="number"
                        value={fundsGoal}
                        onChange={(e) => setFundsGoal(Number(e.target.value) || "")}
                        placeholder="Ingresa el monto"
                        required
                    />
                </label>
                <button type="submit" disabled={!fundsGoal}>Crear</button>
            </form>

            {paymentData && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Pago Creado</h3>
                    <p><strong>Dirección:</strong> {paymentData.address}</p>
                    <p><strong>Red:</strong> {paymentData.network}</p>
                    <img
                        src={paymentData.qrCode}
                        alt="Código QR de pago"
                        style={{ width: "200px", height: "200px" }}
                    />
                </div>
            )}

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default PaymentForm;
