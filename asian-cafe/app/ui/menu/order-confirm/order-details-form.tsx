import { useState } from "react";
import SegmentedControl from "@/app/ui/components/segmented-control";

export default function OrderDetailsForm({ orderDetails, updateOrderDetails, setErrors, errors }) {
  const [selectedOption, setSelectedOption] = useState(orderDetails.pickupOption || "ASAP");

  const openingHours = {
    'Sunday': [],
    'Monday': [],
    'Tuesday': [{ start: '11:00', end: '14:00' }, { start: '16:00', end: '20:00' }],
    'Wednesday': [{ start: '11:00', end: '14:00' }, { start: '16:00', end: '20:00' }],
    'Thursday': [{ start: '11:00', end: '14:00' }, { start: '16:00', end: '20:00' }],
    'Friday': [{ start: '11:00', end: '14:00' }, { start: '16:00', end: '20:00' }],
    'Saturday': [{ start: '16:00', end: '20:00' }],
  };

  const isWithinOpeningHours = (selectedTime) => {
    updateOrderDetails("pickupTime", selectedTime);
    const day = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const hours = openingHours[day];

    const avail = hours.some(({ start, end }) => selectedTime >= start && selectedTime <= end);
    if (!avail) {
      setErrors((prevErrors) => ({ ...prevErrors, time: "Please choose a pickup time within opening hours" }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, time: "" }));
    }
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    updateOrderDetails("pickupOption", option);
    if (option === "ASAP") {
      updateOrderDetails("pickupTime", "ASAP");
    }
  };

  return (
    <div className="mb-4">
      <div className="mb-2">
        <SegmentedControl
          options={[{ label: "ASAP", value: "ASAP" }, { label: "Schedule", value: "Schedule" }]}
          selected={selectedOption}
          onChange={handleOptionChange}
        />
        {selectedOption === "ASAP" && 
          <div className="m-2 text-[15px] italic h-12">
            Your order will be ready for pickup in around <strong>20 minutes</strong>
          </div>
        }

        {selectedOption === "Schedule" && (
          <div>
            <input
              type="time"
              value={orderDetails.pickupTime}
              onChange={(e) => isWithinOpeningHours(e.target.value)}
              className={`w-full border border-gray-300 p-2 rounded ${errors.time ? "bg-pink border-red focus:border-red" : ""}`}
            />
            {errors.time && <p className="text-red text-sm">{errors.time}</p>}
          </div>
        )}
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          value={orderDetails.name}
          onChange={(e) => updateOrderDetails("name", e.target.value)}
          className={`w-full border border-gray-300 p-2 rounded ${errors.name ? "bg-pink border-red focus:border-red" : ""}`}
        />
        {errors.name && <p className="text-red text-sm">{errors.name}</p>}
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Phone Number</label>
        <input
          type="tel"
          value={orderDetails.phone}
          onChange={(e) => updateOrderDetails("phone", e.target.value)}
          className={`w-full border border-gray-300 p-2 rounded ${errors.phone ? "bg-pink border-red focus:border-red" : ""}`}
        />
        {errors.phone && <p className="text-red text-sm">{errors.phone}</p>}
      </div>
    </div>
  );
}