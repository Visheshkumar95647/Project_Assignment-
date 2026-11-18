const STEPS = [
  "pending",
  "preparing",
  "ready",
  "completed",
];

const OrderStatusTracker = ({ status }) => {
  const currentStatus = status?.toLowerCase();

  if (currentStatus === "cancelled") {
    return (
      <div className="bg-red-100 border border-red-300 rounded-lg p-4 mt-6">
        <h3 className="font-semibold text-red-700">
          ❌ Order Cancelled
        </h3>
      </div>
    );
  }

  const currentStep = STEPS.indexOf(currentStatus);

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-5">
        Track Order
      </h3>

      <div className="flex items-center justify-between">

        {STEPS.map((step, index) => (

          <div
            key={step}
            className="flex-1 flex flex-col items-center relative"
          >

            {index !== STEPS.length - 1 && (
              <div
                className={`absolute top-5 left-1/2 w-full h-1 ${
                  index < currentStep
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
            )}

            <div
              className={`w-10 h-10 rounded-full z-10 flex items-center justify-center text-white font-bold ${
                index <= currentStep
                  ? "bg-green-600"
                  : "bg-gray-300"
              }`}
            >
              {index <= currentStep ? "✓" : ""}
            </div>

            <p className="capitalize mt-2 text-sm">
              {step}
            </p>

          </div>

        ))}

      </div>
    </div>
  );
};

export default OrderStatusTracker;