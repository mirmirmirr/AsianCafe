
export default function SpecialRequests({ specialRequests, setSpecialRequests, closeRequest }) {
  return (
    <div 
      className="flex flex-col gap-2 bg-white p-8 rounded-t-[20px] shadow-[0_0px_75px_6px_rgba(0,0,0,0.25)] z-50 fixed bottom-0 w-full"
    >
      <h3 className="text-lg font-semibold">Special Requests</h3>
      <p className="text-sm">
        Please let us know if you have any special requests or dietary
        restrictions.
      </p>
      <textarea
        id="specialRequests"
        value={specialRequests}
        onChange={(e) => setSpecialRequests(e.target.value)}
        placeholder='e.g. "No onions"'
        className="w-full p-2 border rounded"
      ></textarea>
      <button 
        type="button"
        className="px-4 py-3 bg-darkgreen text-[#EBEFE8] font-bold rounded-full hover:bg-darkgreen"
        onClick={closeRequest}
      >
        Done
      </button>
    </div>
  );
}