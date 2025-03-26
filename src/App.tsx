import React from "react";
import PaymentForm from "./components/PaymentForm";
import PaymentStatus from "./components/PaymentStatus";

const App: React.FC = () => {
    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <h1>Gestión de Pagos</h1>
            <hr />
            <PaymentForm />
            <hr />
            <PaymentStatus />
        </div>
    );
};

export default App;
