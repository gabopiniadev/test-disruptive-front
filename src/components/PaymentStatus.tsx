import React, { useState } from "react";
import axios from "axios";

const PaymentStatus: React.FC = () => {
    const [address, setAddress] = useState<string>("");
    const [status, setStatus] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleCheckStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setStatus(null);
        setIsLoading(true);

        try {
            const response = await axios.get(`http://localhost:3000/api/payments/status/${address}`);
            setStatus(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || "Ocurrió un error al consultar el estado del pago.");
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusMessage = () => {
        switch (status.data.status) {
            case "COMPLETED":
                return { message: "¡El pago se realizó con éxito!", color: "green" };
            case "WAITING":
                return { message: "Estamos esperando el pago. Todavía no se han recibido fondos.", color: "orange" };
            case "FAILED":
                return { message: "El estado del pago es fallido. No se completó correctamente.", color: "red" };
            default:
                return { message: "Estado desconocido.", color: "gray" };
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
                <button type="submit" disabled={isLoading || !address}>
                    {isLoading ? "Consultando..." : "Consultar"}
                </button>
            </form>

            {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}

            {status && (
                <>
                <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
                    <h3>Detalles del Estado del Pago</h3>
                    <p>
                        <strong>Dirección:</strong> {status.data.address}
                    </p>
                    <p>
                        <strong>Red:</strong> {status.data.network}
                    </p>
                    <p>
                        <strong>Estado:</strong>{" "}
                        <span style={{ color: getStatusMessage().color }}>
                            {getStatusMessage().message}
                        </span>
                    </p>
                    <p>
                        <strong>Total Recibido:</strong> {status.data.currentBalance} {status.data.smartContractSymbol || "BUSD"}
                    </p>
                    <p>
                        <strong>Dirección del Contrato Inteligente:</strong> {status.data.smartContractAddress}
                    </p>
                    <p>
                        <strong>Objetivo de Fondos:</strong> {status.fundsGoal} {status.data.smartContractSymbol || "BUSD"}
                    </p>
                    <p>
                        <strong>Estado de Fondos:</strong> {status.data.fundStatus}
                    </p>
                    <p>
                        <strong>Progreso del Proceso:</strong> Paso {status.data.processStep} de{" "}
                        {status.processTotalSteps}
                    </p>
                    <p>
                        <strong>Fecha de Expiración:</strong>{" "}
                        {new Date(status.data.fundsExpirationAt * 1000).toLocaleString()}
                    </p>
                    {status.status === "WAITING" && (
                        <p style={{ color: "orange" }}>Estamos esperando los pagos necesarios para completar.</p>
                    )}
                </div>
                </>
            )}

        </div>
    );
};

export default PaymentStatus;
