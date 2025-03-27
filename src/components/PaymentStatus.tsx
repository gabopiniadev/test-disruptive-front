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
        switch (status?.state) {
            case "completed":
                return { message: "¡El pago se realizó con éxito!", color: "green" };
            case "pending":
                return { message: "El pago está pendiente. Aún no se han recibido fondos.", color: "orange" };
            case "failed":
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
                <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px", borderRadius: "8px" }}>
                    <h3>Estado del Pago</h3>
                    <p>
                        <strong>Dirección:</strong> {address}
                    </p>
                    <p>
                        <strong>Estado:</strong>{" "}
                        <span style={{ color: getStatusMessage().color }}>
                            {getStatusMessage().message}
                        </span>
                    </p>
                    <p>
                        <strong>Total Recibido:</strong> {status.totalReceived} {status.currency || "BUSD"}
                    </p>
                    {status.state === "pending" && (
                        <p style={{ color: "orange" }}>
                            Por favor, asegúrate de realizar el pago a la dirección correcta.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default PaymentStatus;
