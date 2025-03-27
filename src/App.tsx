import React, { useState } from "react";
import SimulationForm from "./components/SimulationForm.tsx";
import PaymentStatus from "./components/PaymentStatus.tsx";

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<"simulation" | "payment">("simulation");

    return (
        <div>
            <nav className="navbar">
                <button
                    className={currentView === "simulation" ? "active" : ""}
                    onClick={() => setCurrentView("simulation")}
                >
                    Simulación
                </button>
                <button
                    className={currentView === "payment" ? "active" : ""}
                    onClick={() => setCurrentView("payment")}
                >
                    Estado del Pago
                </button>
            </nav>

            <div style={{ margin: "20px" }}>
                {currentView === "simulation" && <SimulationForm />}
                {currentView === "payment" && <PaymentStatus />}
            </div>
        </div>
    );
};

export default App;
