import React, { useState } from "react";
import axios from "axios";

const SimulationForm: React.FC = () => {
    const [capital, setCapital] = useState<number | "">("");
    const [duration, setDuration] = useState<number>(3);
    const [type, setType] = useState<string>("simple");
    const [simulationResult, setSimulationResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [paymentData, setPaymentData] = useState<any>(null);
    const [isGeneratingQRCode, setIsGeneratingQRCode] = useState<boolean>(false);

    const showSuccessMessage = (message: string) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(null), 5000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSimulationResult(null);

        try {
            const response = await axios.post(
                "http://localhost:3000/api/simulations/calculate",
                { capital, duration, type }
            );
            setSimulationResult(response.data);
            showSuccessMessage("¡Simulación completada con éxito!");
        } catch (err: any) {
            setError(err.response?.data?.error || "Ocurrió un error al realizar la simulación.");
        }
    };

    const handleGenerateQR = async () => {
        if (!capital) {
            setError("Primero debes simular las ganancias.");
            return;
        }

        setError(null);
        setPaymentData(null);
        setIsGeneratingQRCode(true);

        try {
            const response = await axios.post(
                "http://localhost:3000/api/payments/create",
                { fundsGoal: capital }
            );
            setPaymentData(response.data);
            showSuccessMessage("¡El QR de pago se generó correctamente!");
        } catch (err: any) {
            setError(err.response?.data?.error || "Error al generar el QR del pago.");
        } finally {
            setIsGeneratingQRCode(false);
        }
    };

    const handleReset = () => {
        setCapital("");
        setDuration(3);
        setType("simple");
        setSimulationResult(null);
        setError(null);
        setPaymentData(null);
        setIsGeneratingQRCode(false);
        setSuccessMessage("Formulario reiniciado con éxito.");
    };

    return (
        <div>
            <h2>Simulador de Ganancias</h2>

            {successMessage && (
                <div style={{ backgroundColor: "green", color: "white", padding: "10px", borderRadius: "5px", marginBottom: "15px" }}>
                    {successMessage}
                </div>
            )}

            {error && (
                <div style={{ backgroundColor: "red", color: "white", padding: "10px", borderRadius: "5px", marginBottom: "15px" }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <label>
                    Capital Semilla:
                    <input
                        type="number"
                        value={capital}
                        onChange={(e) => setCapital(Number(e.target.value) || "")}
                        placeholder="Ingresa el monto inicial"
                        required
                    />
                </label>

                <label>
                    Duración (Meses):
                    <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
                        <option value={3}>3 Meses</option>
                        <option value={6}>6 Meses</option>
                        <option value={9}>9 Meses</option>
                        <option value={12}>12 Meses</option>
                    </select>
                </label>

                <label>
                    Tipo de Beneficio:
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="simple">Beneficio Simple</option>
                        <option value="compound">Interés Compuesto</option>
                    </select>
                </label>

                <button type="submit" disabled={!capital || !duration || !type}>
                    Simular
                </button>

                <button
                    type="button"
                    onClick={handleReset}
                    style={{
                        marginLeft: "10px",
                        color: "white",
                        backgroundColor: "red",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Reiniciar
                </button>
            </form>

            {simulationResult && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Resultados de la Simulación</h3>
                    <table border={1} style={{ width: "100%", textAlign: "center" }}>
                        <thead>
                        <tr>
                            <th>Mes</th>
                            <th>Ganancia</th>
                            <th>Saldo</th>
                        </tr>
                        </thead>
                        <tbody>
                        {simulationResult.results.map((item: any, index: number) => (
                            <tr key={index}>
                                <td>{item.month}</td>
                                <td>${item.profit}</td>
                                <td>${item.balance}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={2}><strong>Saldo Final Neto</strong></td>
                            <td>${simulationResult.finalBalance}</td>
                        </tr>
                        <tr>
                            <td colSpan={2}><strong>Fee</strong></td>
                            <td>${simulationResult.fee}</td>
                        </tr>
                        </tbody>
                    </table>

                    <button
                        onClick={handleGenerateQR}
                        style={{ marginTop: "15px" }}
                        disabled={isGeneratingQRCode}
                    >
                        {isGeneratingQRCode ? "Generando QR..." : "Depósito Ahora"}
                    </button>

                    {paymentData && (
                        <div style={{ marginTop: "20px" }}>
                            <h4>QR de Pago</h4>
                            <p>
                                <strong>Dirección:</strong> {paymentData.address}
                            </p>
                            <img
                                src={paymentData.qrCode}
                                alt="Código QR de Pago"
                                style={{ width: "200px", height: "200px" }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SimulationForm;
